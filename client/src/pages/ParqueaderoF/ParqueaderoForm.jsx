import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useParams, useNavigate } from 'react-router-dom';
import './Post.css';
import config from '../../config.json';
import PortalLayout from '../../layout/PortalLayout';

const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState({
    title: '',
    content: '',
    horarios: '',
    tarifaCarro: '',
    tarifaMoto: '',
    telefono: '',
    nosotros: '',
    latitud: '',
    longitud: '',
    puestos: ''
  });

  useEffect(() => {
    if (id !== "new") {
      const fetchPost = async () => {
        try {
          const { data } = await axios.get(`${config.apiUrl}/${id}`);
          setPost(data);
        } catch (error) {
          console.error("Error al obtener el parqueadero:", error);
          navigate("/error");
        }
      };
      fetchPost();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos requeridos
    const { title, content,horarios, tarifaCarro, tarifaMoto,  telefono, nosotros,  latitud, longitud, puestos } = post;
    if (!title || !content || !horarios || !tarifaCarro || !tarifaMoto || !telefono || !nosotros || !latitud || !longitud || !puestos) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Validación de formato de teléfono
    const telefonoPattern = /^\d{10}$/;
    if (!telefonoPattern.test(telefono)) {
      alert('Por favor ingresa un número de teléfono válido (10 dígitos sin espacios ni caracteres especiales).');
      return;
    }

    // Validación de longitud y latitud
    if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) {
      alert('Por favor ingresa valores válidos para la latitud (-90 a 90) y la longitud (-180 a 180).');
      return;
    }

    // Envío del formulario si todas las validaciones son exitosas
    try {
      if (id === "new") {
        await axios.post(config.apiUrl, post);
      } else {
        await axios.put(`${config.apiUrl}/${id}`, post);
      }
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'La reserva se guardó correctamente'
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          navigate("/Posts");
        }
      });
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'los datos estan duplicados o ya no coincide con los datos'
      });
    }
  };

  return (
    <PortalLayout>
      <div class="DatosParqueadero">
        <div class="form">
          <form action="#">
            <div class="form-header">
              <div class="title">
                <h2>{id === 'new' ? 'Nuevo Parqueadero' : 'Actualizar Parqueadero'}</h2>
              </div>
            </div>
            
            <div class="input-group">
              <div class="input-box">
                <label for="firstname">Nombre parqueadero</label>
                <input type="text" id="title" placeholder="Ej: parquedero nuevaVista..." name="title"
                  value={post.title} onChange={handleChange} className="form-control" />
              </div>

              <div class="input-box">
                <label for="lastname">Direccion</label>
                <input
                  type="text"
                  id="content"
                  placeholder="Ej: calle 4 ta #23 - 45"
                  name="content"
                  value={post.content}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div class="input-box">
                <label for="lastname">Horarios</label>
                <input
                  type="text"
                  placeholder="Ej: 3h, 24h, 2h"
                  name="horarios"
                  value={post.horarios}
                  onChange={handleChange}
                />
              </div>

              <div class="input-box">
                <label for="lastname">Tarifa Moto</label>
                <input
                  type="text"
                  placeholder="Ej: 1000, 3000, 5000"
                  name="tarifaMoto"
                  value={post.tarifaMoto}
                  onChange={handleChange}
                />
              </div>

              <div class="input-box">
                <label for="lastname">Tarifa Carro</label>
                <input
                  type="text"
                  placeholder="Ej: 10.000, 6.000, 3.000"
                  name="tarifaCarro"
                  value={post.tarifaCarro}
                  onChange={handleChange}
                />
              </div>

              <div class="input-box">
                <label for="email">Telefono</label>
                <input
                  type="text"
                  id="telefono"
                  placeholder="Ej: 3235148905"
                  name="telefono"
                  value={post.telefono}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div class="input-box">
                <label for="number">Latitud</label>
                <input
                  type="number"
                  id="latitud"
                  placeholder="Ej: 4.54536565"
                  name="latitud"
                  value={post.latitud}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div class="input-box">
                <label for="password">Longitud</label>
                <input
                  type="number"
                  id="longitud"
                  placeholder="Ej: -75.8789697"
                  name="longitud"
                  value={post.longitud}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div class="input-box">
                <label for="password">Puesto disponibles</label>
                <input
                  type="number"
                  placeholder="ej: 34"
                  name="puestos"
                  value={post.puestos}
                  onChange={handleChange}
                />
              </div>

              <div class="input-box">
                <label for="password">Descripcion Parqueadero</label>
                <textarea
                  type="text"
                  placeholder="Sobre nosotros.."
                  name="nosotros"
                  value={post.nosotros}
                  onChange={handleChange}
                />
              </div>

            </div>
            <div class="continue-button">
              <button onClick={handleSubmit} className="btn btn-primary">{id === 'new' ? 'Agregar' : 'Actualizar'}</button>
            </div>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Post;
