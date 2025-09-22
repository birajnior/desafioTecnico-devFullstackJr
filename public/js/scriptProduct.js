document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-produto");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nome: document.getElementById("nome").value,
      descricao: document.getElementById("descricao").value,
      preco: document.getElementById("preco").value,
      quantidade: document.getElementById("quantidade").value,
    };

    console.log(data);

    try {
      const response = await fetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Passou aqui", result);

      if (result.success) {
        alert(result.message);
        window.location.href = "/products";
      } else {
        alert("Erro: " + result.message);
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao tentar salvar produto.");
    }
  });
});

// Função para excluir
async function deleteProduct(id) {
  console.log("entrou aqui", id);

  if (!confirm("Deseja realmente excluir este produto?")) return;

  try {
    const response = await fetch(`/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.success) {
      alert(result.message);
      window.location.reload(); // atualiza a lista sem precisar navegar manualmente
    } else {
      alert("Erro: " + result.message);
    }
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
    alert("Erro ao excluir produto.");
  }
}

// Função para editar
async function editProduct(id) {
  console.log(id);

  window.location.href = `/products/${id}/edit`;
}

function buscarItem(e) {
  console.log("estive aqui", e);
}
