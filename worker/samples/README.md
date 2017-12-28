# Requirement

Note that you shall have some `WP_20140830_14_39_10_Pro.mp4` and `WP_20140830_15_13_44_Pro.mp4` files available for testing.

# Folder structure

`./sample.json` a json sample of final cut pro movie project file.

`./jsontomovie.py` a python program to convert a the `sample.json` into ffmpeg commands. It was the original script.

`./app.py` a python program to convert the movies parts to cook video parts. It is the new script.

# How to make a Movie?

`python jsontomovie.py  # This will silently call ffmpeg to generate movie`

or 

`python app.py  # Besides the ffmpeg movie generation, this will call a thread to monitoring the progress.`
