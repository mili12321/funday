import React, { useState, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineSearch } from 'react-icons/hi'

export function Search({
    search,
    setSearch,
    setFilteredFolders,
    setFilteredBoards
}) {
    const currWorkspace = useSelector(state => state.workspace.currWorkspace);
    const [isSearchActive, setSearchActive] = useState(false);
    const inputRef = useRef()

    useEffect(() => {
        setFilteredFolders(
            currWorkspace.folders.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            )
        );

    }, [search, currWorkspace.folders,setFilteredFolders]);

    useEffect(() => {
        setFilteredBoards(
            currWorkspace.boards.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, currWorkspace.boards,setFilteredBoards]);

    // useEffect(() => {
    //     let items = []
    //     currWorkspace.folders.map(folder =>
    //         items=[...items,...folder.boards]
    //     )
    //     setFilteredBoardsInFolders(
    //         items.filter((item) =>
    //             item.name.toLowerCase().includes(search.toLowerCase())
    //         )
    //     )
    // }, [search,currWorkspace.folders]);

 
    return (
        <>
        {!isSearchActive?
            <div className='actions-btn-wrapper'
                onClick={()=>{
                    setSearchActive(true)
                    setTimeout(() => {
                         if(inputRef&&inputRef.current){
                             inputRef.current.focus()
                         }
                    }, 0);
                }}
            >
                <div className="add actions-btn">
                    <HiOutlineSearch className="icon"/>
                    <span>Search</span> 
                </div>
            </div>
        :
        <div className="search">
            <input
                ref={inputRef}
                className="search-input menu-btn"
                type="search"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
                onBlur={(e)=>{
                    if(e.target.value!=='')return
                    setSearchActive(false)
                }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        ev.target.blur()
                    }
                }}
            />
        </div>}
        </>
    )
}


// filters ALL THE ITEMS includes THE BOARDS INSIDE FOLDERS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// const currWorkspace = useSelector(state => state.workspace.currWorkspace);
// const [loading, setLoading] = useState(false);
// // const [search, setSearch] = useState("");
// // const [filteredItems, setFilteredItems] = useState([]);


// useEffect(() => {
//     let items = []
//     currWorkspace.folders.map(folder=>
//         items=[...items, folder]
//     )
//     currWorkspace.boards.map(board=>
//         items=[...items, board]
//     )
//     currWorkspace.folders.map(folder =>
//         items=[...items, ...folder.boards]
//     )
//     setFilteredItems(
//         items.filter((item) =>
//             item.name.toLowerCase().includes(search.toLowerCase())
//         )
//     );

// }, [search, currWorkspace.folders,currWorkspace.boards,setFilteredItems]);


// return (
//     <div className="search">
//         <input
//             type="text"
//             placeholder="Search Countries"
//             onChange={(e) => setSearch(e.target.value)}
//         />
//     </div>
// )