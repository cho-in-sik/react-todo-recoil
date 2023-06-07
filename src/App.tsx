import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { toDoState } from './atoms';
import Board from './components/Board';
import AddBoards from './components/AddBoards';

const Wrapper = styled.div`
  display: flex;
  max-width: 80%;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;

  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;

    if (!destination) return;

    if (source.droppableId === 'boards') {
      //보드 순서 변경
      setToDos((allBoards) => {
        const boardsList = Object.keys(allBoards);
        const taskObj = boardsList[source.index];
        boardsList.splice(source.index, 1);
        boardsList.splice(destination.index, 0, taskObj);
        let boards = {};
        boardsList.map((board) => {
          boards = { ...boards, [board]: allBoards[board] };
        });

        return { ...boards };
      });
    }

    if (destination?.droppableId === source.droppableId) {
      //같은 보드위의 변화
      if (source.droppableId === 'boards') return;

      setToDos((allBoards) => {
        console.log(allBoards);

        const boardCopy = [...allBoards[source.droppableId]];

        const taskObj = boardCopy[source.index];

        //1. source.index 를 한개 지운다
        boardCopy.splice(source.index, 1);
        //2. destination.index 로 item 다시 돌려주기
        boardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };

        //todo값은 객체 형태로 id와 text를 가지고있음. 변화가 생기면 ...로 todo들을 복사해주고 해당 todo를 지정해준다
        //그 후 source.index를 지우고 destination.index에 그 값을 돌려준다. 그후 리턴값으로는 전의 투두들을 전부 다시 가져오고
        //변화 된 값만 key[variable] 로 바꿔서 리턴해준다.
      });
    }
    if (destination.droppableId !== source.droppableId) {
      //다른 보드위의 변화
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];

        const taskObj = sourceBoard[source.index];

        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };

        //움직임시작한 보드에서 그 투두 지워주고 도착지에서 투두 추가해주기
        //...복사로 출발,도착 보드를 변수로 지정해주고 출발 보드에서 그 투두 삭제해주고 도착 보드에서 taskobj를 추가해준다.
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <AddBoards />
      <Wrapper>
        <Droppable droppableId="boards" direction="horizontal" type="board">
          {(provided) => (
            <Boards ref={provided.innerRef} {...provided.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}
export default App;
