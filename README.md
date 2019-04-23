# Introduction
This is a web app for product review search and rating prediction. The review data is from [Kaggle](https://www.kaggle.com/datafiniti/consumer-reviews-of-amazon-products). The source code repository is on [Github](https://github.com/alexalvis/CS525IR)

# Big Question
Amazon is a well-known e-commerce website. It has became main gateway for many people to shop now. Our goal is to improve the review search experience for certain products on Amazon. To be Specific, we provide popular words, n-gram review search, rating prediction to help users gaining more insights regarding the product.

# Take Away
+ We need more balanced data to be able to produce more successful sentimental analysis
+ Use Flask APIs to separate business logic and web service, and facilitate the collaboration among team members. 

Product Search Page:
![Product Search](screenshots/product_search.png)
Product Review Page:
![Product Review](screenshots/product_info.png)

# Initial setup for front end
npm is required for building ReactJS App, so install node.js first then
```
cd client-app/
npm install
npm run build
```
If the front-end code is changed, you have to re-run `npm run build` in `client-app/`

# Python Dependency
+ pandas
+ xgboost
+ flask
+ nltk
+ numpy
+ sklearn

# Run The App
on Windows:
```
./run.ps1
```

on Linux/Mac:
```
./run.sh
```
