import logging
from logging.handlers import TimedRotatingFileHandler

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = TimedRotatingFileHandler(__name__ + '.log', when="m", interval=1, backupCount=5)
formatter = logging.Formatter('[%(levelname)s][%(asctime)s][%(filename)s:%(funcName)s:%(lineno)d][%(message)s]')
handler.setFormatter(formatter)
logger.addHandler(handler)
