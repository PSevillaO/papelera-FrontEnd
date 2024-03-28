import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import './Categories.css'
import Swal from "sweetalert2";



const URL = import.meta.env.VITE_SERVER_URL;

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [expandedMap, setExpandedMap] = useState({});
  const [categoryName, setCategoryName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      const response = await axios.get(`${URL}/categories`);
      setCategories(response.data.categories);

    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  // aca agrego o edito Categorias
  async function submitedData(data) {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("descripcion", data.descripcion);

      //si estroy creando una categoria 
      if (isNew) {
        formData.append("parent", categoryId)
        const response = await axios.post(`${URL}/categories`, formData)
        console.log("Response", response)
        setSelectedCategory(response.data.category)


        Swal.fire({
          title: "Categoria Creada",
          text: `La categoria  ${response.data.category?.nombre} fue creada correctamente`,
          icon: "success"
        });
        getCategories();
        setFormValue(selectedCategory);

      } else {
        // aca estoy editando una categoria
        console.log(data)
        console.log(categoryId)

        const response = await axios.put(`${URL}/categories/${categoryId}`, formData)

        setSelectedCategory(response.data.category)
        Swal.fire({
          title: "Categoria Editada",
          text: `La categoria  ${response.data.category?.nombre} fue Editada correctamente`,
          icon: "success"
        });
        getCategories();
        setFormValue(data);

      }

    } catch (error) {
      console.log("Error ", error)
      // console.log(error.response.status)
      if (error.response.status === 409) {
        Swal.fire({
          title: "Categoria Duplicada",
          text: `La categoria ya existe`,
          icon: "error"
        });
      }
    }
  }

  function handleCategoryDobleClick(category) {
    setCategoryName(category.nombre);
    setCategoryId(category._id)
    setFormValue(category);
    setSelectedCategory(category);
  }

  function newCategory() {
    setFormValue();
    setIsNew(true);

  }

  function setFormValue(category) {
    setValue("nombre", category?.nombre || "")
    setValue("descripcion", category?.descripcion || "")
  }
  // sale del crear categoria
  function exitCategory() {
    setIsNew(false)
    setFormValue(selectedCategory)
  }


  async function deleteCategory(id) {
    Swal.fire({
      title: "Desea la Categoria",
      text: "Se borrar la categoria y sus SubCategorias",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Borrar",
      cancelButtonText: "Cancelar"
    }).then(async function (resultado) {
      try {
        if (resultado.isConfirmed) {
          await axios.delete(`${URL}/categories/${id}`)
          Swal.fire({
            title: "Categoria Borrada",
            text: `La categoria fue borrada correctamente`,
            icon: "success"
          }
          )
          getCategories();
          setFormValue();
        }
      } catch (error) {
        console.log(error)
        Swal.fire({
          title: "Error al borrar la categoria",
          text: `La categoria no pudo ser borrada`,
          icon: "error"
        })
      }
    }
    )
  }




  // Función para manejar la expansión o contracción de una categoría
  const toggleExpand = (categoryId) => {
    setExpandedMap(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId]
    }));
  };

  // Función recursiva para renderizar las categorías y subcategorías
  function renderCategories(categories, level = 0) {
    return (
      <ul className="categories-list">
        {categories.map(category => {
          const key = category._id;
          const expanded = expandedMap[key] || false;
          return (
            <li key={key} className="category-item">
              <div className="category-info" style={{ marginLeft: `${level * 5}px` }}>
                {category.children && category.children.length > 0 && (
                  <button className="button-tree" onClick={() => toggleExpand(key)}>
                    {expanded ? '-' : '+'}
                  </button>
                )}
                <span onDoubleClick={() => handleCategoryDobleClick(category)} className="category-name">
                  {category.nombre}
                </span>
              </div>
              {expanded && category.children && category.children.length > 0 && (
                <ul className="subcategories">
                  {renderCategories(category.children, level + 1)}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="main-category-general">
      <div className="main-tree">
        <div className="category-title">
          <h1>Categorías</h1>
        </div>
        <div className="tree">
          {renderCategories(categories)}
        </div>
      </div>
      <div className="main-category">
        <div className="category-title">
          <h1>{categoryName}</h1>
          <div className="category-buttons">
            {!isNew && (<button className="btn-delete-new" onClick={() => deleteCategory(categoryId)}>
              Borrar
            </button>)}
            <button className="btn-new-button" onClick={() => newCategory()}>New</button>
            {isNew && (
              <button className="btn-salir-new" onClick={() => exitCategory(categories)}>
                X
              </button>
            )}
          </div>
        </div>
        <form action="categories-form" onSubmit={handleSubmit(submitedData)} encType="multipart/form-data" >
          <div className="categories-input">
            <div className="form-group frm-cate">
              <input id="nombre" type="text" className="form-input" placeholder=" " {...register("nombre")} />
              <label className="form-lbl" htmlFor="nombre">Nombre</label>
              <span className="form-line"></span>
            </div>

            <div className="form-group frm-cate">
              <input id="descripcion" type="text" className="form-input" placeholder=" " {...register("descripcion")} />
              <label className="form-lbl" htmlFor="descripcion">Descripcion</label>
              <span className="form-line"></span>
            </div>
            <div className="btn-submit">
              <button type="submit" className={isNew ? "btn-form btn-create" : "btn-form btn-Edit"}     >
                {
                  isNew ? "Crear" : "Editar"
                }
              </button>

            </div>

          </div>
        </form>
      </div>
    </div >
  );
}
