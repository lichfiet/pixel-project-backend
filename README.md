
# r/place clone
This project is intended to showcase abilities ranging from programming to cloud architecture, system design, and a load of other things.
## Start Development

### Requirements

- Docker

- Docker Compose

- Node Version >= 18


### Getting Started

To Start:

```
git clone https://github.com/lichfiet/game.git
```

```
make init
make start
```

OR

Alternatively, if you don't have make installed, you can run

```
chmod u+x ./make/dev-init.sh &&
./make/dev-init.sh &&
docker build -t game:dev --platform linux/amd64 -f ./docker/build.Dockerfile . &&
docker compose -f ./docker/compose.yaml up -d
```

You can connect on [http://localhost:8000/](http://localhost:8000/) after.

  

Any changes made in your `./game` folder will auto-update your live environment thanks to nodemon

# TODO

## Sample of request path for hosting
probably going to need to migrate to k8s while doing this, will implement rabbit first and proxy all the requests
![image](https://media.discordapp.net/attachments/219268654745780225/1209237092371267604/Untitled_Artwork.png?ex=65e630cd&is=65d3bbcd&hm=535ec33656e29681b73d55a3ba9f8e651f3f12da06fd422f0bd2d3250bf0c5b8&=&format=webp&quality=lossless&width=855&height=597)
