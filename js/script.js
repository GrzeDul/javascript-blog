"use strict";
const titleClickHandler = function (event) {
  event.preventDefault();
  console.log("Link was clicked!");
  console.log(event);
  const clickedElement = this;
  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll(".titles a.active");

  for (let activeLink of activeLinks) {
    activeLink.classList.remove("active");
  }
  /* add class 'active' to the clicked link */
  console.log("clickedElement:", clickedElement);
  clickedElement.classList.add("active");

  /* get 'href' attribute from the clicked link */
  const linkAddress = clickedElement.getAttribute("href");
  console.log(linkAddress);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll(".posts article.active");

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(linkAddress);
  /* add class 'active' to the correct article */
  targetArticle.classList.add("active");
};

const links = document.querySelectorAll(".titles a");

for (let link of links) {
  link.addEventListener("click", titleClickHandler);
}
