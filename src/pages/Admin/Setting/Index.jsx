import React from "react";

export default function SettingIndex() {
    return (
        <div className="max-w-3xl bg-white shadow-md rounded-xl p-6 text-gray-800">

            {/* Page Title */}
            <h2 className="text-2xl font-bold mb-6">
                Chatbot System Settings
            </h2>

            <div className="space-y-8">

                {/* AI Settings */}
                <section className="border-b pb-6">

                    <h3 className="text-lg font-semibold mb-4">
                        AI Configuration
                    </h3>

                    <div className="grid grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm mb-2">
                                AI Model
                            </label>
                            <select className="w-full border rounded-lg p-2 bg-white">
                                <option>GPT-4</option>
                                <option>Gemini</option>
                                <option>Claude</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-2">
                                Temperature
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                defaultValue={0.7}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">
                                Max Tokens
                            </label>
                            <input
                                type="number"
                                defaultValue={2000}
                                className="w-full border rounded-lg p-2"
                            />
                        </div>

                    </div>

                </section>

                {/* System Maintenance */}
                <section>

                    <h3 className="text-lg font-semibold mb-4">
                        Maintenance Mode
                    </h3>

                    <label className="flex items-center gap-3 cursor-pointer">

                        <input
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />

                        <span className="text-sm">
                            Enable maintenance mode (temporarily disable chatbot responses)
                        </span>

                    </label>

                </section>

                {/* Save Button */}
                <div className="pt-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Save Settings
                    </button>
                </div>

            </div>
        </div>
    );
}