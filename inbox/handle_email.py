from inbox import Inbox
import logging

logger = logging.Logger(__name__)

inbox = Inbox()


@inbox.collate
def handler(to, sender, subject, body):
    logger.info(body)
    return body


logger.info("Listening on port 4467")
inbox.serve(address="0.0.0.0", port=4467)
