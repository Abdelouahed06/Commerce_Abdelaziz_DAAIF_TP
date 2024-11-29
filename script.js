fetch('./data.json')
  .then(response => response.json())
  .then(products => {
    const productContainer = document.getElementById("productContainer");
    products.forEach((product) => {
      const productCard = createProductCard(product);
      productContainer.appendChild(productCard);
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const imgDiv = document.createElement("div");
  imgDiv.className = "div-img";
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.nom;

  const infoContainer = document.createElement("div");
  infoContainer.className = "product-info";

  const title = document.createElement("h2");
  title.textContent = product.nom;

  const desc = document.createElement("p");
  desc.textContent = product.description;

  const variationsContainer = document.createElement("div");
  variationsContainer.className = "variations";

  const sizesContainer = document.createElement("div");
  sizesContainer.className = "sizes";

  const priceStock = document.createElement("div");
  priceStock.className = "price-stock";

  const addButton = document.createElement("button");
  addButton.className = "add-btn";
  addButton.textContent = "Add to Cart";

  let selectedSize = null;
  let selectedColor = null;
  let outOfStockImage = "https://i.ibb.co/HzLsR9W/out-of-stock.png";

  const updateDisplay = () => {
    const variation = product.variations.find(
      (v) => v.taille === selectedSize && v.couleur.code === selectedColor
    );

    if (variation && variation.quantiteEnStock > 0) {
      image.src = variation.image;
      priceStock.textContent = `Price: ${variation.prix} | Stock: ${variation.quantiteEnStock}`;
    } else {
      image.src = outOfStockImage;
      priceStock.textContent = "";
    }
  };
  const uniqueColors = [
    ...new Map(
      product.variations.map((v) => [v.couleur.code, v.couleur])
    ).values(),
  ];

  uniqueColors.forEach((color) => {
    const colorCircle = document.createElement("div");
    colorCircle.className = "color-circle";
    colorCircle.style.backgroundColor = color.code;

    colorCircle.addEventListener("click", () => {
      card.querySelectorAll(".color-circle").forEach((circle) =>
        circle.classList.remove("selected")
      );
      colorCircle.classList.add("selected");
      selectedColor = color.code;
      updateDisplay();
    });

    variationsContainer.appendChild(colorCircle);
  });

  const uniqueSizes = [...new Set(product.variations.map((v) => v.taille))];

  uniqueSizes.forEach((size) => {
    const sizeCircle = document.createElement("div");
    sizeCircle.className = "size-circle";
    sizeCircle.textContent = size;

    sizeCircle.addEventListener("click", () => {
      card.querySelectorAll(".size-circle").forEach((circle) =>
        circle.classList.remove("selected")
      );
      sizeCircle.classList.add("selected");
      selectedSize = size;
      updateDisplay();
    });

    sizesContainer.appendChild(sizeCircle);
  });

  if (product.variations.length) {
    const defaultVariation = product.variations[0];
    selectedSize = defaultVariation.taille;
    selectedColor = defaultVariation.couleur.code;
    image.src = defaultVariation.image;
    priceStock.textContent = `Price: ${defaultVariation.prix} | Stock: ${defaultVariation.quantiteEnStock}`;
  } else {
    image.src = outOfStockImage;
    priceStock.textContent = "Out of stock";
  }

  addButton.addEventListener("click", () => {
    const variation = product.variations.find(
      (v) => v.taille === selectedSize && v.couleur.code === selectedColor
    );

    if (variation && variation.quantiteEnStock > 0) {
      variation.quantiteEnStock--;
      alert(`Added to cart. Remaining stock: ${variation.quantiteEnStock}`);
      updateDisplay();
    } else {
      alert("Out of stock for selected variation.");
    }
  });

  imgDiv.appendChild(image);
  infoContainer.appendChild(title);
  infoContainer.appendChild(desc);
  infoContainer.appendChild(variationsContainer);
  infoContainer.appendChild(sizesContainer);
  infoContainer.appendChild(priceStock);
  infoContainer.appendChild(addButton);

  card.appendChild(imgDiv);
  card.appendChild(infoContainer);

  return card;
}
