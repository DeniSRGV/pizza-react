import React from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Categories,
  Sort,
  PizzaBlock,
  Skeleton,
  Pagination,
} from "../components";
import { sortList } from "../components/Sort";
import { useAppDispatch } from "../redux/store";
import { selectFilter } from "../redux/filter/selectors";
import { selectPizzaData } from "../redux/pizza/selectors";
import {
  setCategoryId,
  setCurrentPage,
  setFilters,
} from "../redux/filter/slice";
import { fetchPizzas } from "../redux/pizza/asyncActions";
import qs from "qs";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);
  let [searchParams, setSearchParams] = useSearchParams();

  const { items, status } = useSelector(selectPizzaData);
  const { categoryId, sort, currentPage, searchValue } =
    useSelector(selectFilter);

  const onChangeCategory = React.useCallback(
    (idx: number) => {
      dispatch(setCategoryId(idx));
    },
    [dispatch]
  );

  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace("-", "");
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? String(categoryId) : "";
    const search = searchValue;

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      })
    );

    window.scrollTo(0, 0);
  };
  React.useEffect(() => {
    if (window.location.search) {
      const obj: any = {};
      for (const [key, value] of searchParams.entries()) {
        obj[key] = value;
      }
      obj.sort =
        sortList.find((objSort) => objSort.sortProperty === obj.sortProperty) ||
        sortList[0];
      console.log(obj);

      dispatch(setFilters(obj));
    }
    isMounted.current = true;
  }, []);

  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: categoryId,
        sortProperty: sort.sortProperty,
        currentPage: currentPage || 1,
      };
      const queryString = qs.stringify(params, { skipNulls: true });
      setSearchParams(queryString);
      getPizzas();
    }
  }, [categoryId, sort.sortProperty, currentPage, searchValue]);

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>
            К сожалению, не удалось получить питсы. Попробуйте повторить попытку
            позже.
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
