document.addEventListener("DOMContentLoaded", async () => {
  // pega o ID do produto pela URL
  const id = window.location.pathname.split("/")[2]; // /products/123/edit → "123"

  // busca dados do produto
  try {
    const res = await fetch(`/products/${id}`);
    const data = await res.json();

    if (data.success) {
      const produto = data.produto;

      // preencher os campos
      document.getElementById("nome").value = produto.nome;
      document.getElementById("descricao").value = produto.descricao;
      document.getElementById("preco").value = produto.preco;
      document.getElementById("quantidade").value = produto.quantidade;
    } else {
      alert("Erro: " + data.message);
    }
  } catch (error) {
    console.error("Erro ao carregar produto:", error);
    alert("Erro ao carregar informações.");
  }

  // intercepta o submit para salvar alterações
  const form = document.getElementById("form-edit");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const editData = {
      descricao: document.getElementById("descricao").value,
      preco: document.getElementById("preco").value,
      quantidade: document.getElementById("quantidade").value,
    };

    try {
      const response = await fetch(`/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.href = "/products"; // volta pra lista
      } else {
        alert("Erro: " + result.message);
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao salvar alterações.");
    }
  });
});



