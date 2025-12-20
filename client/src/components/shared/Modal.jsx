import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
        full: 'max-w-full mx-4',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`${sizeClasses[size]} w-full`}
                            >
                                <div className="card relative">
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-200">
                                        <h2 className="text-2xl font-bold">{title}</h2>
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-200 rounded-full transition-colors"
                                        >
                                            <IoClose className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">{children}</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Fragment>
            )}
        </AnimatePresence>
    );
};
