FROM ubuntu:18.04

# Installing nodejs / npm
RUN apt-get update
RUN apt-get install -y curl


RUN curl -sL https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh -o install_nvm.sh
RUN bash install_nvm.sh
RUN nvm install 12.10.0


RUN sudo apt-get install -y libatk-bridge2.0-0
RUN sudo apt-get install -y libatk-bridge2.0-0
RUN sudo apt-get install -y libxkbcommon
RUN sudo apt-get install -y libgbm-dev
RUN sudo apt-get install -y libxkbcommon-x11-0
RUN sudo apt-get install -y libgtk-3-0
RUN sudo apt-get install -y libasound2

RUN npm install wappalyzer -g