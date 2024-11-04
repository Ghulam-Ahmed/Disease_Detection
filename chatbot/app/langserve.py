# langserve.py

def add_routes(app, handler, path):
    @app.post(path)
    async def route_handler(request: dict):
        topic = request.get("topic")
        response = handler.run(topic)
        return {"message": response}