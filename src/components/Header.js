// rafce
import React from 'react'

const Header = () => {
    return (
        <header className="header"> {/* 리액트에서는 클래스를 줄 때 className 을 작성 */}
            <h1>COVID-19</h1>
            <select>
                <option>국내</option>
                <option>해외</option>
            </select>
        </header>
    )
}

export default Header
