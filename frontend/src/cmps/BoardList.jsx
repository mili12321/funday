import React, { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs'
import { BoardPreview } from './BoardPreview'

export function BoardList({
    boards,
    onGettingCurrentBoard,
    CgViewComfortable,
    removeBoard,
    editBoard,
    moveBoard,
    moveBoardToFolder,
    object,
    scroll,
    cmp
}) {

    // const boards = useSelector(state => state.workspace.boards);

    if (!boards) return <div>Loading...</div>
    return (
      <>
       {boards.map((board,index)=>
              <BoardPreview
              board={board}
              onGettingCurrentBoard={onGettingCurrentBoard}
              CgViewComfortable={CgViewComfortable}
              BsThreeDots={BsThreeDots}
              removeBoard={removeBoard}
              editBoard={editBoard}
              moveBoard={moveBoard}
              moveBoardToFolder={moveBoardToFolder}        
              object={object}
              scroll={scroll}
              cmp={cmp}
              />
        )}
      </>
    );
}