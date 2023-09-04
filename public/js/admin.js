const deleteProduct = async btn => {
  const productId = btn.parentNode.querySelector('[name=productId').value;
  const _csrf = btn.parentNode.querySelector('[name=_csrf').value;

  const productElement = btn.closest('article');

  const config = { method: 'DELETE', headers: { 'csrf-token': _csrf } };

  const response = await fetch(`/admin/product/${productId}`, config);

  if (!response.ok) console.log(response);

  const data = await response.json();

  productElement.remove();
  //   productElement.parentNode.removeChild(productElement); // for internet explorer

  console.log(data);
};
