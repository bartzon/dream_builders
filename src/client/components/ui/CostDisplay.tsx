interface CostDisplayProps {
  originalCost: number;
  discount?: number;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function CostDisplay({ originalCost, discount = 0, className = '', size = 'medium' }: CostDisplayProps) {
  const finalCost = Math.max(0, originalCost - discount);
  const hasDiscount = discount > 0;
  
  const sizeClasses = {
    small: 'text-xs',
    medium: 'text-sm', 
    large: 'text-base'
  };
  
  if (!hasDiscount) {
    return (
      <span className={`font-bold ${sizeClasses[size]} ${className}`}>
        {originalCost}
      </span>
    );
  }
  
  return (
    <span className={`font-bold ${sizeClasses[size]} ${className}`}>
      <span className="line-through text-red-400 opacity-75 mr-1">
        {originalCost}
      </span>
      <span className="text-green-400">
        {finalCost}
      </span>
    </span>
  );
} 