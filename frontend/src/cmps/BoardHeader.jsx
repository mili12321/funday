import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable';
import { withRouter } from "react-router";
import { connect } from 'react-redux'
import { loadWorkspaces, updateWorkspace } from '../store/actions/workspaceActions'
import { getCurrBoard, updateCurrBoard} from '../store/actions/workspaceActions'
import { boardService } from '../services/boardService'
// import { useDispatch, useSelector } from "react-redux";
import { toggleFavUserBoardList } from '../store/actions/userActions'

import { BsFillStarFill,BsPeople,BsThreeDots,BsFilter } from 'react-icons/bs'
import { SiProbot } from 'react-icons/si'
import { ImTable } from 'react-icons/im'
import {IoIosArrowDown} from 'react-icons/io'
import { HiOutlineSearch } from 'react-icons/hi'
import { BiUserCircle } from 'react-icons/bi'
import { RiArrowUpDownFill } from 'react-icons/ri'

export class _BoardHeader extends Component {
    state={
        board:{},
        name:'',
        desc:'',
        isSearchActive:false
    }
    inputRef = React.createRef();
    async componentDidMount(){
        if(this.props.board){
            this.setState({name:this.props.board.name})
            this.setState({desc:this.props.board.desc})
            this.setState({board:this.props.board}) 
        }
        
        this.editableBoardName = React.createRef();
        this.editableBoardDesc = React.createRef();
    }
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.id !==  this.props.match.params.id) {
        this.setState({name:this.props.board.name})
        this.setState({desc:this.props.board.desc})
        this.setState({board:this.props.board}) 
        }

        if (prevProps.board.name !==  this.props.board.name) {
            this.setState({name:this.props.board.name})
            this.setState({desc:this.props.board.desc})
            this.setState({board:this.props.board}) 
        }
    }
    focusText = () => {
        setTimeout(() => {
            document.execCommand('selectAll', false, null)
        }, 0)
    }
    handleChangeBoardName = (ev) => {
        this.setState({name: ev.target.value})
        this.setState({ board: { ...this.state.board, name: ev.target.value } })
    }
    handleChangeBoardDesc=(ev)=>{
        this.setState({desc: ev.target.value})
        this.setState({ board: { ...this.state.board, desc: ev.target.value } })
    }
    changeToContentEditable=(value)=>{
            let content = [];
            if(value==='name'){
                content.push(
                    <ContentEditable
                        onFocus={this.focusText}
                        className='content-editable'
                        innerRef={this.editableBoardName}
                        html={this.state.name}
                        disabled={false}  
                        onChange={this.handleChangeBoardName}
                        onBlur={() => {
                            // if (this.props.board.name === this.state.board.name) return
                            // const desc = `${loggedUser.username} Changed the task name from ${task[taskKey]} to ${this.state.task.name}`
                            const updatedBoard = {
                                ...this.props.board,
                                name: this.state.name
                            }
                            this.props.onEditBoard(updatedBoard)
                            this.props.updateCurrBoard(updatedBoard)

                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                    />
                )
            }else{
                content.push(
                    <ContentEditable
                        onFocus={this.focusText}
                        className='content-editable'
                        innerRef={this.editableBoardDesc}
                        html={this.state.desc}
                        disabled={false}  
                        onChange={this.handleChangeBoardDesc}
                        onBlur={() => {
                            // if (this.props.tableColumn.taskKey === this.state.currTableColumn.taskKey&&this.props.tableColumn.title === this.state.currTableColumn.title) return
                            //  if (this.props.board.desc === this.state.board.desc) return
                            // const desc = `${loggedUser.fullName} Changed the task name from ${task[taskKey]} to ${this.state.task.name}`
                            const updatedBoard = {
                                ...this.props.board,
                                desc:this.state.desc
                            }
                            this.props.onEditBoard(updatedBoard)
                            this.props.updateCurrBoard(updatedBoard)
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                ev.target.blur()
                            }
                        }}
                    />
                )
            }
            
            return content;
    }

    getFavBoardStyle(){
            if(this.props.loggedInUser.favBoards.includes(this.state.board._id)){
                return 'fav'
            }
    }
    toggleFavUserBoardList=()=>{
       this.props.toggleFavUserBoardList(this.props.loggedInUser,this.props.board._id)
    }
    render() {
        const {
            onAddNewTable,
            setSearch
        } = this.props
        const {board} = this.state
        if (!board) return <div>Loading....</div>
        return (
        <div className="board-header">
                        <div className="board-info">
                            <div>
                                <span className="board-title">
                                    {/* {board.name} */}
                                    {this.changeToContentEditable('name')}
                                </span>
                                <div className='add-to-favorite-btn'>
                                    <BsFillStarFill 
                                    className={`BsFillStarFill ${this.getFavBoardStyle()}`}
                                    onClick={this.toggleFavUserBoardList}
                                    />
                                    {this.props.loggedInUser.favBoards.includes(board._id)?<span className="label-text arrow-up">Remove from favorites</span>:
                                    <span className="label-text arrow-up">Add to favorites</span>}
                                </div>
                            </div>
                            <div>
                                <div className="board-viewers">
                                    img
                                </div>
                                <div className="board-integrations">
                                    <div className="icons-container">
                                        <div className="icon-hexagon-wrapper">
                                            <img src="https://img.icons8.com/color/13/000000/slack-new.png" alt=''/>
                                        </div>
                                        <div className="icon-hexagon-wrapper">
                                            <img src="https://img.icons8.com/fluent/13/000000/gmail--v1.png" alt=''/>
                                        </div>
                                    </div>
                                    <span>Integrate / 2</span>
                                </div>
                                <div className="board-automations">
                                    <SiProbot />
                                    <span>Automate / 2</span>
                                </div>
                                <div className="board-subscribers">
                                    <BsPeople/>
                                    <span> / 1</span>
                                </div>
                                <div className="board-activities">
                                    Activities / 0
                                </div>
                                <div className="board-more-options">
                                    <BsThreeDots />
                                </div>
                            </div>
                        </div>
                        <div className="board-desc">
                        {/* {board.desc} */}
                        {this.changeToContentEditable('desc')}
                        </div>
                        <div className="board-actions">
                            <div>
                                <ImTable style={{ width: '15px', height: '15px' }}/>
                                <span className="main-table">Main Table / 4</span>
                                <IoIosArrowDown style={{ width: '12px', height: '12px' }}/>
                            </div>
                            <div className="actions-continer">
                                <div onClick={onAddNewTable}>
                                    <span>New Item</span>
                                    <IoIosArrowDown style={{ width: '12px', height: '12px' }}/>
                                </div>
                                <div className="header-search-wrapper">
                                {!this.state.isSearchActive?
                                <div onClick={()=>{
                                    this.setState({isSearchActive:true})
                                   setTimeout(() => {
                                       if(this.inputRef&&this.inputRef.current){
                                            this.inputRef.current.focus()
                                       }
                                   }, 0);
                                }}
                                className="header-action-btn"
                                >
                                    <HiOutlineSearch/>
                                    <span>Search</span>
                                </div>:
                                <input className="search-input stretch-left" ref={this.inputRef} type="search" onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search'
                                onBlur={(e)=>{
                                    if(e.target.value!=='')return
                                    this.setState({isSearchActive:false})

                                }}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') {
                                        ev.target.blur()
                                    }
                                }}
                                />}
                                </div>
                                
                                <div>
                                    <BiUserCircle/>
                                    <span>Person</span>
                                </div>
                                <div>
                                    <BsFilter/>
                                    <span>Filter</span>
                                </div>
                                <div>
                                    <RiArrowUpDownFill/>
                                    <span>Sort</span>
                                </div>
                                <div>
                                    <BsThreeDots />
                                </div>
                            </div>
                        </div>
        </div>
    );
}}
const mapStateToProps = state => {
    return {
        workspaces: state.workspace.workspaces,
        board: state.workspace.currBoard,
        loggedInUser: state.user.loggedInUser,
    }
}
const mapDispatchToProps = {
    loadWorkspaces,
    updateWorkspace,
    toggleFavUserBoardList,
    updateCurrBoard
}
export const BoardHeader = connect(mapStateToProps, mapDispatchToProps)(withRouter(_BoardHeader))
