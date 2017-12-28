FROM daocloud.io/mixslice/ffmpeg-python

RUN mkdir -p /code
WORKDIR /code

COPY requirement.txt /code
RUN pip install --no-cache-dir -r requirement.txt

COPY . /code

EXPOSE 8080
CMD ["python", "main.py"]