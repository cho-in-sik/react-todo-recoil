import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragabbleCard } from './DraggableCard';
import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import { ITodo, toDoState } from '../atoms';
import { useSetRecoilState } from 'recoil';

const Wrapper = styled.div`
  width: 300px;
  padding-top: 20px;

  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? '#dfe6e9'
      : props.isDraggingFromThis
      ? '#b2bec3'
      : 'transparent'};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 90%;
  }
  text-align: center;
`;

const Input = styled.input`
  height: 45px;
  border-radius: 10px;
  border: none;
  font-size: 13px;
  :hover {
    border-color: ${(props) => props.theme.bgColor};
  }
`;

const Button = styled.button`
  margin: 0 auto;
  margin-bottom: 20px;
  border: none;
  width: 80%;
  color: #ff00008a;
  border-radius: 5px;
  cursor: pointer;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  index: number;
}

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId, index }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [newToDo, ...allBoards[boardId]],
      };
    });
    setValue('toDo', '');
  };

  const handleBoardDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setToDos((allBoards) => {
      const boardKeys = Object.keys(allBoards);
      console.log(allBoards);

      boardKeys.splice(index, 1);

      let boards = {};
      boardKeys.map((item) => {
        boards = { ...boards, [item]: allBoards[item] };
      });

      return { ...boards };
    });
  };
  return (
    <Draggable draggableId={boardId} index={index}>
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Title>{boardId}</Title>
          <Button onClick={handleBoardDelete}>✘</Button>

          <Form onSubmit={handleSubmit(onValid)}>
            <Input
              {...register('toDo', { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}`}
            />
          </Form>
          <Droppable droppableId={boardId} type="todo">
            {(magic, info) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    boardId={boardId}
                    key={toDo.id}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                    index={index}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default Board;
