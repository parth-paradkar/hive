from aiosmtpd.controller import Controller
import logging

PORT = 4467

logging.basicConfig(level=logging.DEBUG)


class SMTPHandler:
    async def handle_DATA(self, server, session, envelope):
        logging.info(f"from: {envelope.mail_from}")
        logging.info(f"to: {envelope.rcpt_tos}")
        logging.info(f"data:\n{envelope.content}")
        return "250 OK"


handler = SMTPHandler()

controller = Controller(handler=handler, port=PORT)
logging.info(f"Listening on port {PORT}")
controller.start()
