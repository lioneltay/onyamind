# only run the docker command if you don't have and don't want to install Ruby
docker run -it --rm ruby:latest bash
gem install travis