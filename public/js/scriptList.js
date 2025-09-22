document.addEventListener("DOMContentLoaded", () => {
  const inputSearch = document.querySelector("input[name='q']");
  const formSearch = document.querySelector("form.d-flex");
  const cardsContainer = document.querySelector(".row");

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const termo = inputSearch.value.toLowerCase();

    const filtrados = produtosList.filter((p) =>
      p.nome.toLowerCase().includes(termo)
    );

    renderCards(filtrados);
  });

  function renderCards(lista) {
    cardsContainer.innerHTML = "";

    if (lista.length === 0) {
      cardsContainer.innerHTML =
        "<p class='text-center'>Nenhum produto encontrado.</p>";
      return;
    }

    lista.forEach((produto) => {
      const card = document.createElement("div");
      card.className = "col-md-4 mb-4";
      card.innerHTML = `
        <div class="card h-100 shadow-sm bg-dark text-light">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-success">${produto.nome}</h5>
            <h6 class="card-text mb-2">
              Preço: R$ ${Number(produto.preco).toFixed(2)}
            </h6>
            <p class="card-text flex-grow-1">
              ${produto.descricao}<br>
              <strong>Quantidade:</strong> ${produto.quantidade}
            </p>
            <div class="mt-auto d-flex justify-content-between">
              <button class="btn btn-sm btn-primary" onclick="editProduct('${
                produto.id
              }')">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct('${
                produto.id
              }')">Excluir</button>
            </div>
          </div>
        </div>`;
      cardsContainer.appendChild(card);
    });
  }
});

async function deleteProduct(id) {
  if (!confirm(`Deseja realmente excluir o produto ${id}?`)) return;

  try {
    const response = await fetch(`/products/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (result.success) {
      alert(result.message);
      window.location.reload();
    } else {
      alert("Erro: " + result.message);
    }
  } catch (err) {
    console.error("Erro:", err);
  }
}

function editProduct(id) {
  window.location.href = `/products/${id}/edit`;
}
