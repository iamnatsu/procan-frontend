FROM nginx:1.15.8
COPY nginx.conf.template /etc/nginx/
COPY static-html-directory /usr/share/nginx/html

ENV BACK_URL      http://127.17.0.1:3000

CMD /bin/bash -c "envsubst '\$BACK_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"