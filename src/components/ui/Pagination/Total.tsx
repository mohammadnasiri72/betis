const Total = (props: { total: number }) => {
    const { total } = props
    return (
        <div className="pagination-total">
            جمع <span>{total}</span> موارد
        </div>
    )
}

export default Total
