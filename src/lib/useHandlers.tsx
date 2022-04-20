import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { setProfile, removeToken } from "../redux/authSlice";
import { setTracks } from "../redux/trackSlice";
import { getTracks, createPlaylist, addToPlaylist, getUser } from "./fetchApi";

function useHandlers() {
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  let { token, profile } = useAppSelector((state: any) => state.auth);
  let { selectedTracks } = useAppSelector((state: any) => state.track);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleProfile = async () => {
    const userData = await getUser(token);
    dispatch(setProfile(userData));
  };

  const handleSearch = async (e: any) => {
    e.preventDefault();
    const searchParam = e.target.searchParam.value;
    console.log(`q: ${searchParam}`);
    console.log(token);
    const trackData = await getTracks(token, searchParam);
    dispatch(setTracks(trackData));
  };

  // TODO: generates on second click only!
  const handlePlaylist = async (e: any) => {
    e.preventDefault();
    setTitle(e.target.title.value);
    setDescription("empty");

    console.log(title + description);
    console.log(token);
    console.log(`profile: ${profile}`);
    const playlistId = await createPlaylist(title, description, token, profile);
    
    // TODO: debug
    console.log(`pId: ${playlistId}`);
    console.log(`selectedsongs: ${selectedTracks}`);

    await addToPlaylist(playlistId, token, selectedTracks);
  };

  const logout = () => {
    dispatch(removeToken());
    navigate("/");
  };

  return { handleProfile, handleSearch, handlePlaylist, logout };
}

export default useHandlers;
