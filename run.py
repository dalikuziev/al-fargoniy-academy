import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print(" Al-Farg'oniy Academy REST API Server ishga tushmoqda...")
    print(" Swagger Hujjatlari (UI): http://127.0.0.1:8000/docs")
    print(" Frontend ilovasi:        http://127.0.0.1:8000")
    print("=" * 60)
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True, reload_dirs=["app"])
