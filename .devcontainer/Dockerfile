# Use an official PHP image as a base image
FROM php:8.2-fpm

# Install system dependencies for Laravel and extensions
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    unzip \
    git \
    libicu-dev \
    libxml2-dev \
    bash \
    curl \
    && docker-php-ext-configure zip \
    && docker-php-ext-install gd zip intl pdo pdo_mysql

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www

# Copy application code into the container
COPY . /var/www

# Copy local PHP configuration
COPY ./php/local.ini /usr/local/etc/php/conf.d/local.ini

# Set permissions for the Laravel project directory
RUN chown -R www-data:www-data /var/www && chmod -R 755 /var/www

# Download the wait-for-it script to ensure DB is ready before running migrations
COPY ./wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

# Install Laravel dependencies using Composer
RUN composer install --no-interaction --optimize-autoloader

# Generate the Laravel application key
RUN php artisan key:generate

# Wait for MySQL service to be ready and run migrations
RUN /usr/local/bin/wait-for-it db:3306 -- php artisan migrate --force

# Expose port 80 for the app
EXPOSE 80

# Set the entrypoint for the container to start PHP-FPM
CMD ["php-fpm"]
