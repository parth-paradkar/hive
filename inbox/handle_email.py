from aiosmtpd.controller import Controller
import asyncio
import logging

PORT = 4467

logging.basicConfig(level=logging.DEBUG)

loop = asyncio.get_event_loop()


class SMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        logging.info(f"from: {envelope.mail_from}")
        logging.info(f"to: {envelope.rcpt_tos}")
        logging.info(f"data:\n{envelope.content}")
        return "250 OK"


if __name__ == '__main__':

    handler = SMTPHandler()

    controller = Controller(handler=handler, port=PORT)

    logging.info(f"Listening on port {PORT}")
    controller.start()

    try:
        loop.run_forever()
    except KeyboardInterrupt:
        print("Shutting down")
    finally:
        controller.stop()
        loop.stop()
        loop.close()
