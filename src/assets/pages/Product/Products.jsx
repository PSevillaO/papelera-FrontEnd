
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import './Product.css'
import { ProductsTable } from "./ProductsTable";


const URL = import.meta.env.VITE_SERVER_URL;

export default function Products() {
  const { register, handleSubmit, setValue } = useForm();
  const [productId, setProductId] = useState()
  const [dbProducts, setdbProducts] = useState([]);

  const [foundCategories, setFoundCategories] = useState([]);
  const [showFoundCategories, setShowFoundCategories] = useState(false)
  const [showFoundCategoriesFilter, setShowFoundCategoriesFilter] = useState(false)
  const [categoryName, setCategoryName] = useState(null)
  const [categoryNameFilter, setCategoryNameFilter] = useState(null) // Esta es la categoria para filtrar la tabla
  const [categories, setCategories] = useState([])
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);



  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    getProducts();
    getSuppliers();
  }, [limit]) // eslint-disable-line react-hooks/exhaustive-deps


  async function getProducts(page = 0) {
    try {
      const response = await axios.get(`${URL}/products?page=${page}&limit=${limit}`);
      const products = response.data.products;
      const total = response.data.total
      setdbProducts(products);
      setTotal(total);

    } catch (error) {
      console.error(error)
      Swal.fire({
        title: "No se pudieron obtener los Productos",
        icon: 'error'
      })
    }
  }

  async function getSuppliers() {
    try {
      const response = await axios.get(`${URL}/suppliers`)
      const suppliersBD = response.data.suppliers;

      setSuppliers(suppliersBD);

    } catch (error) {
      console.error(error)
    }
  }


  async function submitedData(data) {
    try {
      const formData = new FormData();

      formData.append("articulo", data.articulo);
      formData.append("descripcion", data.descripcion);
      formData.append("detalle", data.detalle);
      formData.append("presentacion", data.presentacion);
      formData.append("unidad", data.unidad);
      formData.append("bulto", data.bulto); // Nuevo campo 
      formData.append("precio", data.precio);
      formData.append("category", categories._id);//esta categoria la saco de un estado es la caregoria que seleciona al pricipio
      formData.append("stock", data.stock);
      // formData.append("suppliers", data.suppliers);

      const supplierIds = selectedSuppliers.filter(id => id !== '');
      supplierIds.forEach(id => {
        formData.append("suppliers[]", id);
      });

      // console.log("data ", data)
      // console.log("categories ", categories)

      // Si estoy editando hace un put 
      if (productId) {

        const response = await axios.put(`${URL}/products/${productId}`, formData)

        // console.log("response", response)
        Swal.fire({
          title: "Producto Editado",
          text: `El Producto ${response.data.product?.descripcion} fue editado correctamente`,
          icon: "success"
        });
        getProducts();
        setProductId(null);
        setFormValue();
        return;
      }
      // Si no edito hago un post 

      const response = await axios.post(`${URL}/products/`, formData);

      console.log(response)
      Swal.fire({
        title: "Producto Creado",
        text: `El Producto ${response.data.product?.descripcion} fue creado correctamente`,
        icon: "success"
      });
      getProducts();
      setFormValue();
    } catch (error) {
      console.error(error)
      Swal.fire({
        title: "No se creo el Producto",
        text: "Alguno de los datos ingresados no son correctos",
        icon: "error"
      });
    }
  }

  function setFormValue(product) {

    setProductId(product?._id || null)

    setValue("articulo", product?.articulo || "")
    setValue("descripcion", product?.descripcion || "")
    setValue("detalle", product?.detalle || "")
    setValue("presentacion", product?.presentacion || "")
    setValue("unidad", product?.unidad || "")
    setValue("bulto", product?.bulto || "")
    setValue("precio", product?.precio || "")
    setValue("category", product?.category._id || "")
    setValue("stock", product?.stock || "")
    setValue("suppliers", product?.suppliers || "")
    setSelectedSuppliers([])

    if (product && product.category) {
      // Asigna el valor de la categoría al estado categoryName
      setCategoryName(product.category?.nombre || "");
      setCategories(product.category)
    }

    if (!product) {
      setCategoryName();
    }



  }

  async function deleteProducts(id) {
    Swal.fire({
      title: "Desea borrar el Producto",
      text: "Realmente desea borrar el Producto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar"
    }).then(async function (resultado) {
      try {
        if (resultado.isConfirmed) {
          const response = await axios.delete(`${URL}/products/${id}`)
          console.log(response)
          Swal.fire({
            title: "Producto Borrado",
            text: `El Producto ${response.data.product?.descripcion} fue borrado correctamente`,
            icon: "success"
          }
          )
          getProducts();
        }
      } catch (error) {
        console.error(error)
        Swal.fire({
          title: "Error al borrar el Producto",
          text: `El Producto no pudo ser borrado`,
          icon: "error"
        })
      }
    }
    )
  }


  async function handleSearch(e) {
    try {
      const search = e.target.value
      if (search.length <= 2) {
        return getProducts();
      }
      const response = await axios.get(`${URL}/products/search/${search}`)
      const products = response.data.product;
      setdbProducts(products);
    } catch (error) {
      console.error(error)
    }
  }

  // Busca las categorias para cargar los productos
  async function handleSearchCategory(e) {
    const search = e.target.value.trim();
    if (search.length < 1) {
      setFoundCategories([]);
      setShowFoundCategories(false);
      return;
    }
    try {
      const response = await axios.get(`${URL}/categories/search/${search}`);
      const foundCategories = response.data.category;
      setFoundCategories(foundCategories);
      setShowFoundCategories(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron obtener las categorías',
        icon: 'error',
      });
    }
  }

  // Busca la Categorias para filtrar la tabla
  async function handleSearchCategoryFilter(e) {
    const search = e.target.value.trim();
    if (search.length < 1) {
      setFoundCategories([]);
      setShowFoundCategoriesFilter(false);
      return;
    }
    try {
      const response = await axios.get(`${URL}/categories/search/${search}`);
      const foundCategories = response.data.category;
      setFoundCategories(foundCategories);
      setShowFoundCategoriesFilter(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudieron obtener las categorías',
        icon: 'error',
      });
    }
  }


  function handleCategorySelect(category) {
    // Aquí puedes manejar la selección de la categoría, por ejemplo, asignándola a un estado en tu componente
    setCategories(category)
    setCategoryName(category.nombre)
    // También podrías ocultar las categorías encontradas después de seleccionar una
    setShowFoundCategories(false);
  }

  function handleCategorySelectFilter(category) {
    // Aquí puedes manejar la selección de la categoría, por ejemplo, asignándola a un estado en tu componente
    setCategoryNameFilter(category.nombre)
    // También podrías ocultar las categorías encontradas después de seleccionar una
    setShowFoundCategoriesFilter(false);
  }


  function categorySalir() {
    setCategoryName();
    setCategoryNameFilter();
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCategoryIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCategoryIndex((prevIndex) =>
        prevIndex < foundCategories.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCategoryIndex !== -1) {
        const category = foundCategories[selectedCategoryIndex];
        handleCategorySelect(category);
      }
    }
  }

  function handleKeyDownFilter(e) {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCategoryIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCategoryIndex((prevIndex) =>
        prevIndex < foundCategories.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedCategoryIndex !== -1) {
        const category = foundCategories[selectedCategoryIndex];
        handleCategorySelectFilter(category);
      }
    }
  }

  function addSupplierField() {
    setSelectedSuppliers([...selectedSuppliers, '']);
  }

  function removeSupplierField(index) {
    const updatedSuppliers = [...selectedSuppliers];
    updatedSuppliers.splice(index, 1);
    setSelectedSuppliers(updatedSuppliers);
  }


  // Función para manejar cambios en los campos de proveedor
  function handleSupplierChange(index, value) {
    const newSelectedSuppliers = [...selectedSuppliers];
    newSelectedSuppliers[index] = value;
    setSelectedSuppliers(newSelectedSuppliers);
  }


  return (
    <div className="main-container form">
      <div className="input-form">

        <div className="category">
          {categoryName && (
            <div className="prod-category-title">
              <div>
                <button className="btn-salir" onClick={() => categorySalir()}>X</button>
              </div>
              <div>
                <p>{categoryName}</p>
              </div>
            </div>
          )}
          {!categoryName && (
            <div>
              <input id="category"
                type="text"
                className="form-input"
                placeholder="Buscar Categoria..."
                onKeyUp={handleSearchCategory}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                defaultValue={categoryName || ""} />
              {showFoundCategories && (
                <div className="select-category">
                  {foundCategories.map((category, index) => (
                    <div key={category._id} onClick={() => handleCategorySelect(category)}
                      className={selectedCategoryIndex === index ? 'selected-row' : ''}  >
                      {category.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <h2 className="input-title">
            {productId && (
              <button className="btn-salir-edit" onClick={() => setFormValue()}>
                <span className="fa-solid fa-xmark" aria-hidden="true"></span>
              </button>
            )}
          </h2>
        </div>

        <form action="products-form" onSubmit={handleSubmit(submitedData)} encType="multipart/form-data" >
          <div className="main-input-prod">
            <div className="form-group">
              <input id="articulo" type="text" className="form-input" placeholder=" " {...register("articulo")} />
              <label className="form-lbl" htmlFor="articulo">Articulo</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="descripcion" type="text" className="form-input" placeholder=" " {...register("descripcion")} />
              <label className="form-lbl" htmlFor="descripcion">Descripcion</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="detalle" type="text" className="form-input" placeholder=" "  {...register("detalle")} />
              <label className="form-lbl" htmlFor="detalle">Detalle</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="presentacion" type="text" className="form-input" placeholder=" " {...register("presentacion")} />
              <label className="form-lbl" htmlFor="presentacion">Presentacion</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="unidad" type="text" className="form-input" placeholder=" " {...register("unidad")} />
              <label className="form-lbl" htmlFor="unidad">Unidad</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="bulto" type="text" className="form-input" placeholder=" " {...register("bulto")} />
              <label className="form-lbl" htmlFor="bulto">Bulto</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="precio" type="text" className="form-input" placeholder=" "  {...register("precio")} />
              <label className="form-lbl" htmlFor="precio">Precio</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group">
              <input id="stock" type="text" className="form-input" placeholder=" " {...register("stock")} />
              <label className="form-lbl" htmlFor="stock">Stock</label>
              <span className="form-line"></span>
            </div>


            <div className="form-group-suppliers">
              <div>
                {selectedSuppliers.map((supplier, index) => (
                  <div className="select-suppliers" key={index}>
                    <select
                      value={supplier}
                      {...register("suppliers")}
                      onChange={(e) => handleSupplierChange(index, e.target.value)}
                    >
                      <option value="">Seleccionar Proveedor</option>
                      {suppliers.map((provider) => (
                        <option key={provider._id} value={provider._id}>
                          {provider.nombre}
                        </option>
                      ))}
                    </select>
                    {/* <button type="button" onClick={() => removeSupplierField(index)}> */}
                    {/* - */}
                    {/* </button> */}
                    <button className='btn-delete' onClick={() => removeSupplierField(index)}>
                      <span className="fa-solid fa-trash" aria-hidden="true"></span>
                    </button>

                  </div>
                ))}
              </div>
              <button className="btn-add-suppliers" type="button" onClick={addSupplierField}>
                + Proveedor
              </button>

              {/* <label className="form-lbl" htmlFor="suppliers">Proveedor</label> */}
              <span className="form-line"></span>
            </div>
          </div>

          <div className="btn-submit">
            <button type="submit" className={productId ? "btn-form btn-Edit" : "btn-form btn-create"} >
              {
                productId ? "Editar" : "Crear"
              }</button>
          </div>
        </form >
      </div>
      <div className="main-table">
        <div className="flex-between">
          <i className="fa-solid fa-magnifying-glass"></i>
          <div className="input-group input-search">
            <input type="text" onKeyUp={handleSearch} />
          </div>


          <div>
            {categoryNameFilter && (
              <div className="prod-category-title">
                <div>
                  <button className="btn-salir" onClick={() => categorySalir()}>X</button>
                </div>
                <div>
                  <p>{categoryNameFilter}</p>
                </div>
              </div>
            )}
            {!categoryNameFilter && (
              <div>
                <input id="category"
                  type="text"
                  className="form-input"
                  placeholder="Filtrar Categoria..."
                  onKeyUp={handleSearchCategoryFilter}
                  onKeyDown={handleKeyDownFilter}
                  autoComplete="off"
                  defaultValue={categoryNameFilter || ""} />
                {showFoundCategoriesFilter && (
                  <div className="select-category">
                    {foundCategories.map((category, index) => (
                      <div key={category._id} onClick={() => handleCategorySelectFilter(category)}
                        className={selectedCategoryIndex === index ? 'selected-row' : ''}  >
                        {category.nombre}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <ProductsTable products={dbProducts} deleteProducts={deleteProducts} setFormValue={setFormValue} categoryNameFilter={categoryNameFilter} />
        <div className="pagination-container">
          <div className="page-container">
            {Array.from({ length: Math.ceil(total / limit) }).map((_, idx) => (
              <button key={idx} onClick={() => getProducts(idx)}>
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="limit-container">
            <select className="selc" onChange={(e) => setLimit(e.target.value)}>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
    </div >
  )
}

