
import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  X,
  MessageCircle,
  Loader2,
  MapPin,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HotelChatbot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      sender: "bot",
      text: "Hello! Tell me your city, budget, room type, or required facilities.",
      rooms: [],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const cleanInput = input.trim();

    if (!cleanInput || isLoading) {
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: cleanInput,
      rooms: [],
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL ||
        "http://localhost:3000";

      const { data } = await axios.post(
        `${backendUrl}/api/chatbot/search`,
        {
          message: cleanInput,
        }
      );

      const botMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text:
          data.message ||
          "Here are the matching rooms.",
        rooms: Array.isArray(data.rooms)
          ? data.rooms
          : [],
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);
    } catch (error) {
      console.error(
        "Chatbot request error:",
        error.response?.data || error.message
      );

      const errorMessage = {
        id: crypto.randomUUID(),
        sender: "bot",
        text:
          error.response?.data?.message ||
          "I could not search hotels right now.",
        rooms: [],
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    setInput(suggestion);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition hover:scale-105 hover:bg-blue-700"
          aria-label="Open hotel assistant"
        >
          <MessageCircle size={27} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex h-[600px] w-[calc(100%-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-6 sm:right-6">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-blue-600 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Bot size={22} />
              </div>

              <div>
                <h2 className="font-semibold">
                  StayTonight Assistant
                </h2>

                <p className="text-xs text-blue-100">
                  Search hotels using natural language
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-white/20"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.sender === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-3 text-sm text-white"
                      : "max-w-[95%] rounded-2xl rounded-bl-sm border bg-white px-4 py-3 text-sm text-gray-700 shadow-sm"
                  }
                >
                  <p>{message.text}</p>

                  {message.rooms?.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {message.rooms.map((room) => (
                        <HotelResultCard
                          key={room.roomId}
                          room={room}
                          onOpen={() => {
                            setIsOpen(false);
                            navigate(
                              `/rooms/${room.roomId}`
                            );
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm text-gray-600 shadow-sm">
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Searching your database...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="flex shrink-0 gap-2 overflow-x-auto border-t bg-white px-3 py-2">
            {[
              "Hotels under $500",
              "Cheapest room in Lucknow",
              "Room with WiFi and breakfast",
            ].map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() =>
                  handleSuggestion(suggestion)
                }
                className="shrink-0 rounded-full border border-blue-200 px-3 py-1.5 text-xs text-blue-700 transition hover:bg-blue-50"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 items-center gap-2 border-t bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              maxLength={500}
              placeholder="Find a hotel under $450..."
              className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={
                isLoading || !input.trim()
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2
                  size={19}
                  className="animate-spin"
                />
              ) : (
                <Send size={19} />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

const HotelResultCard = ({
  room,
  onOpen,
}) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="block w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition hover:border-blue-400 hover:shadow-md"
    >
      {room.image ? (
        <img
          src={room.image}
          alt={room.hotelName || "Hotel room"}
          className="h-32 w-full object-cover"
        />
      ) : (
        <div className="flex h-24 w-full items-center justify-center bg-gray-100 text-xs text-gray-500">
          No image available
        </div>
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900">
            {room.hotelName ||
              "Unnamed Hotel"}
          </h3>

          {room.rating > 0 && (
            <div className="flex shrink-0 items-center gap-1 text-xs text-amber-600">
              <Star
                size={13}
                fill="currentColor"
              />
              <span>{room.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-1 flex items-start gap-1 text-xs text-gray-500">
          <MapPin
            size={13}
            className="mt-0.5 shrink-0"
          />

          <span>
            {room.address
              ? `${room.address}, ${room.city}`
              : room.city ||
                "Location unavailable"}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500">
              {room.roomType ||
                "Room type unavailable"}
            </p>

            <p className="mt-1 text-base font-semibold text-blue-700">
              ${room.pricePerNight}{" "}
              <span className="text-xs font-normal text-gray-500">
                per night
              </span>
            </p>
          </div>

          <span className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">
            View Room
          </span>
        </div>

        {room.amenities?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {room.amenities
              .slice(0, 3)
              .map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600"
                >
                  {amenity}
                </span>
              ))}
          </div>
        )}
      </div>
    </button>
  );
};

export default HotelChatbot;