FROM ruby:2.4.2-stretch

ARG RUBY_ENVIRONMENT=development
ENV RAILS_ENV=development

# get Node
#RUN curl -sL https://deb.nodesource.com/setup_9.x | bash - && apt-get install -y nodejs
#RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

RUN apt-get update && \
	apt-get install -y nano curl libmagic-dev apt-transport-https gnupg nodejs --no-install-recommends

# prep scripts
ADD ./*.sh /tmp/
RUN chmod +x /tmp/*.sh

# install Watchman
#RUN /tmp/install_watchman.sh
	
#RUN cp /etc/hosts ~/hosts.new && sed -i '/ip6-/d' ~/hosts.new && cp -f ~/hosts.new /etc/hosts

# install official phantomjs binaries
RUN /tmp/install_phantomjs.sh

# install chrome for default testem config (as of 2.15.0)
#RUN /tmp/install_chrome.sh

WORKDIR /source

# setup base environment
RUN gem install bundler rails
RUN npm install -g ember-cli@2.18.2 bower@1.8.0

#RUN npm install -g phantomjs@2.1.1 --unsafe-perm

EXPOSE 3000 4200 7020 5779

CMD ["/bin/bash"]