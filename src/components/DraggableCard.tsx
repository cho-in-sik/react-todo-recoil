import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from '../atoms';

const Card = styled.div<{ isDragging: boolean }>`
  position: relative;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) =>
    props.isDragging ? '#74b9ff' : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? '0px 2px 5px rgba(0,0,0,0.5)' : 'none'};
`;

const Button = styled.button`
  position: absolute;
  right: 10px;
  bottom: 7px;
  background-color: #ff00006c;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  color: #f5f5f5;
  &.modify {
    margin-right: 35px;
  }
  cursor: pointer;
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

export function DragabbleCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDragabbleCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    setToDos((allBoards) => {
      const selectedBoard = [...allBoards[boardId]];

      selectedBoard.splice(index, 1);

      return { ...allBoards, [boardId]: selectedBoard };
    });
  };
  const handleModify = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // console.log(toDoText);
    // setToDos((allBoards) => {
    //   const selectedBoard = [...allBoards[boardId]];

    //   selectedBoard.splice(index, 0,);
    //   return {};
    // });
  };
  return (
    <Draggable draggableId={toDoId + ''} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
          <Button onClick={handleModify} className="modify">
            ✔︎
          </Button>
          <Button onClick={handleDelete}>✘</Button>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DragabbleCard);
