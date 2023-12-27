import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LucideIcon } from 'lucide-react'

interface TryButtonProps {
  variant?: 'default' | 'outline' | 'success' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg'
  label: string
  tooltipText?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  icon?: LucideIcon
  iconPosition?: 'start' | 'end'
}

export function TryButton({
  variant,
  size,
  label,
  tooltipPosition,
  tooltipText,
  icon: Icon,
  iconPosition = 'start',
}: TryButtonProps) {
  return (
    <div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
            >
              {Icon && iconPosition === 'start' && (
                <Icon className="h-4 w-4 mr-2" />
              )}
              {label}
              {Icon && iconPosition === 'end' && (
                <Icon className="h-4 w-4 ml-2" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipPosition}>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
