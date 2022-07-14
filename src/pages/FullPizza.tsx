import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "../components";
import { FullPizzaType } from "../redux/pizza/types";

const FullPizza: React.FC = () => {
  const [pizza, setPizza] = React.useState<FullPizzaType>();
  const { id } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          "https://626d16545267c14d5677d9c2.mockapi.io/items/" + id
        );
        setPizza(data);
      } catch (error) {
        alert("Ошибка при получении пиццы!");
        navigate("/");
      }
    }

    fetchPizza();
  }, [id, navigate]);

  if (!pizza) {
    return <Spinner />;
  }

  return (
    <div className="container container--card">
      <img className="pizza-block__img" src={pizza?.imageUrl} alt="pizza img" />
      <h2 className="pizza-block__title">{pizza?.title}</h2>
      <h4 className="pizza-block__price">{pizza?.price} ₽</h4>
      <Link to="/">
        <button className="button button--outline button--add button--back">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  );
};

export default FullPizza;
