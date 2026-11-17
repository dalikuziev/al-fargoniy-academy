import uvicorn
from app.logger import logger

if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info(" Al-Farg'oniy Academy CRM Server ishga tushmoqda...")
    logger.info(" Veb-ilova: http://127.0.0.1:8000")
    logger.info("=" * 60)
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, reload_dirs=["app"])
