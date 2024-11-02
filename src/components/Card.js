const Card = ({ className = '', children, ...props }) => {
    return (
      <div 
        className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  };
  
  export default Card;