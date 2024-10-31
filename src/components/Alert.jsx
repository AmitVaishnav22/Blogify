import React from "react";

export default function Alert({ message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="mb-4 text-gray-800">{message}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-red-500 text-white px-4 py-2 mr-2 rounded-lg"
                        onClick={onConfirm}
                    >
                        Yes
                    </button>
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                        onClick={onCancel}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}