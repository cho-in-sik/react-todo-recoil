import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from '../atoms';

const Input = styled.input`
  width: 150px;
  height: 50px;
  border-radius: 5px;
  border: none;
`;
const Form = styled.form`
  position: absolute;
  top: 12%;
  left: 12%;
`;

interface IBoard {
  boardName: string;
}

const AddBoards = () => {
  const { register, handleSubmit, setValue } = useForm<IBoard>();
  const [board, setBoard] = useRecoilState(toDoState);

  const handleNewBoard = ({ boardName }: IBoard) => {
    setBoard((allBoards) => {
      return { ...allBoards, [boardName]: [] };
    });
    setValue('boardName', '');
  };
  return (
    <Form onSubmit={handleSubmit(handleNewBoard)}>
      <Input
        {...register('boardName', { required: true })}
        type="text"
        placeholder="Create New Board"
      />
    </Form>
  );
};

export default AddBoards;
