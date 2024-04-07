import { restaurantRow, restaurantModal } from "/Tehtavat/Tehtava1/components.js";

const restaurants = [];

const table = document.querySelector("table");
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

const getRestaurants = async () => {
  try {
    const response = await fetch(
      "https://10.120.32.94/restaurant/api/v1/restaurants"
    );
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    } else {
      const data = await response.json();
      data.forEach((restaurant) => {
        restaurants.push(restaurant);
      });
      restaurants.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      createTable();
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

const getDailyMenu = async (id) =>{
  try {
    const response = await fetch(
      `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${id}/fi`
    );
    if (!response.ok) {
      throw new Error(error);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

const createTable = () => {
  restaurants.forEach((restaurant) => {

    const row = restaurantRow(restaurant);

    row.addEventListener("click", async () => {
      document.querySelectorAll("tr").forEach((row) => {
        row.classList.remove("highlight");
      });
      row.classList.add("highlight");
      modal.style.display = "block";

      const modalContent = document.querySelector(".modal-content");

      while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
      }
      const menuPromise = getDailyMenu(restaurant._id);
      menuPromise.then((menu) => {
        modalContent.innerHTML = restaurantModal(restaurant, menu);
      });
    });

    table.appendChild(row);
  });
  span.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

getRestaurants();
