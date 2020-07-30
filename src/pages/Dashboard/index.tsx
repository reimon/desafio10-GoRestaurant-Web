import React, { useState, useEffect, useCallback } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      api.get('/foods').then(response => {
        setFoods(response.data);
      });
    }

    loadFoods();
  }, []);

  const handleAddFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> => {
      try {
        await api
          .post('/foods', {
            ...food,
            available: true,
          })
          .then(response => {
            const newFood = response.data;
            setFoods([...foods, newFood]);
          });
        // TODO ADD A NEW FOOD PLATE TO THE API
      } catch (err) {
        console.log(err);
      }
    },
    [foods],
  );

  const handleUpdateFood = useCallback(
    async (food: Omit<IFoodPlate, 'id' | 'available'>): Promise<void> => {
      // TODO UPDATE A FOOD PLATE ON THE API
      const { id, available } = editingFood;

      await api
        .put(`/foods/${id}`, {
          available,
          ...food,
        })
        .then(response => {
          setFoods(
            foods.map(findFood => {
              if (findFood.id === id) {
                return response.data;
              }

              return findFood;
            }),
          );
        });
    },
    [foods, editingFood],
  );

  const handleDeleteFood = useCallback(
    async (id: number): Promise<void> => {
      // TODO DELETE A FOOD PLATE FROM THE API
      await api.delete(`/foods/${id}`).then(response => {
        setFoods(foods.filter(food => food.id !== id));
      });
    },
    [foods],
  );

  const toggleModal = useCallback((): void => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditModalOpen(true);
    setEditingFood(food);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
