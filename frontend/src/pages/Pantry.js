import PantryList from "./features/pantry_list/PantryList";

const Pantry = () => {
    return (
        <div>
            <h1>Pantry</h1>
            <p>
                This is where you can add and manage your pantry items.
            </p>
            <PantryList />
        </div>
    );
}

export default Pantry;