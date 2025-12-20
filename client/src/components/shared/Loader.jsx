import { motion } from 'framer-motion';

export const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const loader = (
        <motion.div
            className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 dark:bg-dark-50/80 backdrop-blur-sm flex items-center justify-center z-50">
                {loader}
            </div>
        );
    }

    return <div className="flex items-center justify-center p-8">{loader}</div>;
};

export const SkeletonLoader = ({ className = '' }) => (
    <div className={`skeleton ${className}`} />
);

export const CardSkeleton = () => (
    <div className="card p-4 space-y-4">
        <SkeletonLoader className="h-48 w-full" />
        <SkeletonLoader className="h-4 w-3/4" />
        <SkeletonLoader className="h-4 w-1/2" />
        <div className="flex gap-2">
            <SkeletonLoader className="h-8 w-20" />
            <SkeletonLoader className="h-8 w-20" />
        </div>
    </div>
);
