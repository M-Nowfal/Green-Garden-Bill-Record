export const Loader = () => {

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 vw-100 position-absolute z-3" style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}>
            <div className="spinner-border text-primary fs-1" role="status" style={{ width: '5rem', height: '5rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}
