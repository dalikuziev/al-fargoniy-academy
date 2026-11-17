import os
import sys
import logging
from loguru import logger

# Asosiy loyiha katalogi va logs papkasi
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOGS_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

APP_LOG_PATH = os.path.join(LOGS_DIR, "app.log")
ERROR_LOG_PATH = os.path.join(LOGS_DIR, "error.log")


class InterceptHandler(logging.Handler):
    """
    Standart Python logging (uvicorn, fastapi, sqlalchemy) xabarlarini
    ushlab olib Loguru'ga yo'naltiruvchi handler.
    """
    def emit(self, record: logging.LogRecord) -> None:
        # Loguru darajasini aniqlash
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Qayerdan chaqirilganini aniqlash
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )


def setup_logging(log_level: str = "INFO"):
    """
    Loguru sozlamalarini to'liq sozlash:
    1. Konsolga chiroyli va rangli chiqarish
    2. logs/app.log ga kunlik/hajmiy rotatsiya bilan yozish
    3. logs/error.log ga faqat xatoliklarni to'liq diagnostika bilan yozish
    4. Uvicorn va FastAPI loglarini loguru bilan birlashtirish
    """
    # Standart loguruni tozalash
    logger.remove()

    # 1. Konsolga chiqarish (chiroyli ranglar bilan)
    logger.add(
        sys.stdout,
        level=log_level,
        colorize=True,
        format=(
            "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
            "<level>{message}</level>"
        ),
    )

    # 2. Barcha umumiy loglar (app.log)
    # 10 MB dan oshganda avtomatik arxivlanadi, 14 kun saqlanadi, zip bilan siqiladi
    logger.add(
        APP_LOG_PATH,
        level="INFO",
        rotation="10 MB",
        retention="14 days",
        compression="zip",
        encoding="utf-8",
        enqueue=True,  # Multithread/async xavfsizligi
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
    )

    # 3. Faqat xatoliklar (error.log)
    # Diagnose va backtrace faol bo'lib, xato chiqqan qator va o'zgaruvchilarni to'liq ko'rsatadi
    logger.add(
        ERROR_LOG_PATH,
        level="ERROR",
        rotation="10 MB",
        retention="30 days",
        compression="zip",
        encoding="utf-8",
        backtrace=True,
        diagnose=True,
        enqueue=True,
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} - {message}",
    )

    # Standart uvicorn va boshqa kutubxonalar loglarini ushlash
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(log_level)

    for logger_name in (
        "uvicorn",
        "uvicorn.access",
        "uvicorn.error",
        "fastapi",
        "starlette",
        "sqlalchemy.engine",
    ):
        mod_logger = logging.getLogger(logger_name)
        mod_logger.handlers = [InterceptHandler()]
        mod_logger.propagate = False

    logger.info("Loguru tizimi muvaffaqiyatli ishga tushirildi. Loglar: logs/app.log")


__all__ = ["logger", "setup_logging"]
