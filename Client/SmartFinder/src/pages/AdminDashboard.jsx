import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from "reactstrap";
import {
  fetchRestaurants, createRestaurant, removeRestaurant, updateRestaurant,
  createMeal, removeMeal, updateMeal,
} from "../features/restaurantSlice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const { restaurants, loading } = useSelector((state) => state.restaurants);

  useEffect(() => { dispatch(fetchRestaurants()); }, [dispatch]);

  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (restaurants.length > 0 && !selectedId) setSelectedId(restaurants[0]._id);
  }, [restaurants, selectedId]);

  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", category: "", image: "", description: "", location: "Muscat", rating: "", services: [], lat: "", lng: "", isOpen: true });
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: "", price: "", category: "", image: "" });
  const [editingMeal, setEditingMeal] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: "", id: null });

  const currentRestaurant = restaurants.find((r) => r._id === selectedId);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    if (!newRestaurant.name) {
      alert("Restaurant name is required");
      return;
    }

    const ratingNum = parseFloat(newRestaurant.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Rating must be a number between 1 and 5");
      return;
    }

    const latNum = parseFloat(newRestaurant.lat);
    const lngNum = parseFloat(newRestaurant.lng);
    if (newRestaurant.lat !== "" && (isNaN(latNum) || latNum < -90 || latNum > 90)) {
      alert("Latitude must be between -90 and 90");
      return;
    }
    if (newRestaurant.lng !== "" && (isNaN(lngNum) || lngNum < -180 || lngNum > 180)) {
      alert("Longitude must be between -180 and 180");
      return;
    }

    if (newRestaurant.name && newRestaurant.category) {
      const restaurantData = {
        ...newRestaurant,
        rating: ratingNum,
        lat: latNum || 0,
        lng: lngNum || 0,
      };
      await dispatch(createRestaurant(restaurantData));
      setNewRestaurant({ name: "", category: "", image: "", description: "", location: "Muscat", rating: "", services: [], lat: "", lng: "", isOpen: true });
      setShowAddRestaurant(false);
    }
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewRestaurant({ ...newRestaurant, services: [...newRestaurant.services, value] });
    } else {
      setNewRestaurant({ ...newRestaurant, services: newRestaurant.services.filter((s) => s !== value) });
    }
  };

  const handleEditServiceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setEditingRestaurant({ ...editingRestaurant, services: [...(editingRestaurant.services || []), value] });
    } else {
      setEditingRestaurant({ ...editingRestaurant, services: (editingRestaurant.services || []).filter((s) => s !== value) });
    }
  };

  const submitEditRestaurant = async (e) => {
    e.preventDefault();
    if (!editingRestaurant.name) {
      alert("Restaurant name is required");
      return;
    }

    const ratingNum = parseFloat(editingRestaurant.rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      alert("Rating must be a number between 1 and 5");
      return;
    }

    const latNum = parseFloat(editingRestaurant.lat);
    const lngNum = parseFloat(editingRestaurant.lng);
    if (editingRestaurant.lat !== "" && (isNaN(latNum) || latNum < -90 || latNum > 90)) {
      alert("Latitude must be between -90 and 90");
      return;
    }
    if (editingRestaurant.lng !== "" && (isNaN(lngNum) || lngNum < -180 || lngNum > 180)) {
      alert("Longitude must be between -180 and 180");
      return;
    }

    const updatedData = {
      ...editingRestaurant,
      rating: ratingNum,
      lat: latNum || 0,
      lng: lngNum || 0,
    };
    await dispatch(updateRestaurant({ id: editingRestaurant._id, updatedData }));
    setEditingRestaurant(null);
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (newMeal.name && newMeal.price && selectedId) {
      await dispatch(createMeal({ restaurantId: selectedId, meal: { ...newMeal, price: parseFloat(newMeal.price) } }));
      setNewMeal({ name: "", price: "", category: "", image: "" });
      setShowAddMeal(false);
      dispatch(fetchRestaurants());
    }
  };

  const handleEditMeal = async (e) => {
    e.preventDefault();
    if (editingMeal) {
      await dispatch(updateMeal({ restaurantId: selectedId, mealId: editingMeal._id, updatedMeal: { name: editingMeal.name, price: parseFloat(editingMeal.price), category: editingMeal.category, image: editingMeal.image } }));
      setEditingMeal(null);
      dispatch(fetchRestaurants());
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.type === "restaurant") {
      await dispatch(removeRestaurant(deleteModal.id));
      const remaining = restaurants.filter((r) => r._id !== deleteModal.id);
      setSelectedId(remaining[0]?._id || null);
    } else if (deleteModal.type === "meal") {
      await dispatch(removeMeal({ restaurantId: selectedId, mealId: deleteModal.id }));
      dispatch(fetchRestaurants());
    }
    setDeleteModal({ open: false, type: "", id: null });
  };

  if (loading && restaurants.length === 0) {
    return (<div className="loading-container" style={{ paddingTop: "6rem" }}><div className="spinner" /><p className="loading-text">Loading dashboard...</p></div>);
  }

  const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };

  return (
    <div className="dashboard-page">
      <Container fluid>
        <Row>
          <Col md={3} style={{ background: "var(--bg-secondary)", minHeight: "100vh", borderRight: "1px solid var(--border-color)", padding: "8rem 1.5rem 1.5rem 1.5rem" }}>
            <div style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--primary)", marginBottom: "0.3rem" }}>🍔 SmartFinder</div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "2rem" }}>Admin Dashboard</div>
            <h6 style={{ color: "var(--text-secondary)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px", marginBottom: "1rem" }}>Restaurants</h6>
            {restaurants.map((r) => (
              <div key={r._id} onClick={() => setSelectedId(r._id)} style={{ padding: "0.7rem 1rem", borderRadius: "var(--radius-sm)", cursor: "pointer", marginBottom: "0.3rem", background: selectedId === r._id ? "rgba(232, 93, 4, 0.15)" : "transparent", color: selectedId === r._id ? "var(--primary)" : "var(--text-secondary)", fontWeight: selectedId === r._id ? 600 : 400, transition: "all 0.2s ease", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{r.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem" }}>⭐ {r.rating}</span>
                  <button
                    type="button"
                    title="Update restaurant"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(r._id);
                      setEditingRestaurant({ ...r, isOpen: r.isOpen ?? true });
                    }}
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem", padding: "0.15rem 0.35rem", lineHeight: 1 }}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    title="Delete restaurant"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({ open: true, type: "restaurant", id: r._id });
                    }}
                    style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem", padding: "0.15rem 0.35rem", lineHeight: 1 }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <Button className="btn-apply-filter" style={{ marginTop: "1rem" }} onClick={() => setShowAddRestaurant(true)}>+ Add Restaurant</Button>
          </Col>

          <Col md={9} style={{ padding: "8rem 2rem 2rem 2rem" }}>
            {currentRestaurant ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 style={{ fontWeight: 800, marginBottom: "0.3rem" }}>{currentRestaurant.name}</h2>
                    <p style={{ color: "var(--text-muted)", margin: 0 }}>{currentRestaurant.category} • {currentRestaurant.location}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <Button className="btn-apply-filter" size="sm" onClick={() => setShowAddMeal(true)}>+ Add Meal</Button>
                  </div>
                </div>
                <h5 style={{ fontWeight: 700, marginBottom: "1rem" }}>Meals ({currentRestaurant.meals?.length || 0})</h5>
                {!currentRestaurant.meals || currentRestaurant.meals.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">🍽️</div><h4>No meals yet</h4><p>Add meals to this restaurant.</p></div>
                ) : (
                  <Row>
                    {currentRestaurant.meals.map((meal) => (
                      <Col md={4} key={meal._id} className="mb-4">
                        <div className="restaurant-card">
                          <div className="card-img-container">
                            <img src={meal.image} alt={meal.name} />
                            <span className="card-img-overlay-badge">${meal.price.toFixed(2)}</span>
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{meal.name}</h5>
                            <span className="cuisine-badge">{meal.category}</span>
                            <div className="d-flex gap-2 mt-2">
                              <Button size="sm" className="btn-view-details" style={{ flex: 1 }} onClick={() => setEditingMeal({ ...meal })}>✏️ Edit</Button>
                              <Button size="sm" className="btn-cancel" style={{ flex: 1 }} onClick={() => setDeleteModal({ open: true, type: "meal", id: meal._id })}>🗑️ Delete</Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                )}
              </>
            ) : (
              <div className="empty-state"><div className="empty-icon">📋</div><h4>No restaurant selected</h4><p>Select a restaurant from the sidebar or add a new one.</p></div>
            )}
          </Col>
        </Row>
      </Container>

      {showAddRestaurant && (
        <div style={overlayStyle} onClick={() => setShowAddRestaurant(false)}>
          <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1.4rem" }}>Add Restaurant</h2>
            <Form onSubmit={handleAddRestaurant}>
              <FormGroup>
                <Label>Restaurant Name</Label>
                <Input type="text" placeholder="Restaurant name" value={newRestaurant.name} onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Category</Label>
                <Input type="text" placeholder="e.g. Italian, Japanese" value={newRestaurant.category} onChange={(e) => setNewRestaurant({ ...newRestaurant, category: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Image URL</Label>
                <Input type="text" placeholder="https://..." value={newRestaurant.image} onChange={(e) => setNewRestaurant({ ...newRestaurant, image: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" placeholder="Restaurant description" value={newRestaurant.description} onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label>Rating</Label>
                <Input type="number" min="1" max="5" step="0.1" placeholder="e.g. 4.5" value={newRestaurant.rating} onChange={(e) => setNewRestaurant({ ...newRestaurant, rating: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Services</Label>
                <div>
                  <FormGroup check inline>
                    <Input type="checkbox" value="dine-in" checked={newRestaurant.services.includes("dine-in")} onChange={handleServiceChange} />
                    <Label check>Dine-in</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input type="checkbox" value="delivery" checked={newRestaurant.services.includes("delivery")} onChange={handleServiceChange} />
                    <Label check>Delivery</Label>
                  </FormGroup>
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <div>
                  <FormGroup check inline>
                    <Input type="radio" name="addStatus" checked={newRestaurant.isOpen === true} onChange={() => setNewRestaurant({ ...newRestaurant, isOpen: true })} />
                    <Label check>Open</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input type="radio" name="addStatus" checked={newRestaurant.isOpen === false} onChange={() => setNewRestaurant({ ...newRestaurant, isOpen: false })} />
                    <Label check>Closed</Label>
                  </FormGroup>
                </div>
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Latitude</Label>
                    <Input type="number" step="any" min="-90" max="90" placeholder="e.g. 23.588" value={newRestaurant.lat} onChange={(e) => setNewRestaurant({ ...newRestaurant, lat: e.target.value })} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Longitude</Label>
                    <Input type="number" step="any" min="-180" max="180" placeholder="e.g. 58.382" value={newRestaurant.lng} onChange={(e) => setNewRestaurant({ ...newRestaurant, lng: e.target.value })} />
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button className="btn-auth" type="submit" style={{ flex: 1 }}>Add</Button>
                <Button className="btn-clear-filter" type="button" onClick={() => setShowAddRestaurant(false)} style={{ flex: 1 }}>Cancel</Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {editingRestaurant && (
        <div style={overlayStyle} onClick={() => setEditingRestaurant(null)}>
          <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1.4rem" }}>Edit Restaurant</h2>
            <Form onSubmit={submitEditRestaurant}>
              <FormGroup>
                <Label>Restaurant Name</Label>
                <Input type="text" placeholder="Restaurant name" value={editingRestaurant.name} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Category</Label>
                <Input type="text" placeholder="e.g. Italian, Japanese" value={editingRestaurant.category} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, category: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Image URL</Label>
                <Input type="text" placeholder="https://..." value={editingRestaurant.image || ""} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, image: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label>Description</Label>
                <Input type="textarea" placeholder="Restaurant description" value={editingRestaurant.description || ""} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, description: e.target.value })} />
              </FormGroup>
              <FormGroup>
                <Label>Rating</Label>
                <Input type="number" min="1" max="5" step="0.1" placeholder="e.g. 4.5" value={editingRestaurant.rating || ""} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, rating: e.target.value })} required />
              </FormGroup>
              <FormGroup>
                <Label>Services</Label>
                <div>
                  <FormGroup check inline>
                    <Input type="checkbox" value="dine-in" checked={editingRestaurant.services?.includes("dine-in")} onChange={handleEditServiceChange} />
                    <Label check>Dine-in</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input type="checkbox" value="delivery" checked={editingRestaurant.services?.includes("delivery")} onChange={handleEditServiceChange} />
                    <Label check>Delivery</Label>
                  </FormGroup>
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <div>
                  <FormGroup check inline>
                    <Input type="radio" name="editStatus" checked={editingRestaurant.isOpen === true} onChange={() => setEditingRestaurant({ ...editingRestaurant, isOpen: true })} />
                    <Label check>Open</Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input type="radio" name="editStatus" checked={editingRestaurant.isOpen === false} onChange={() => setEditingRestaurant({ ...editingRestaurant, isOpen: false })} />
                    <Label check>Closed</Label>
                  </FormGroup>
                </div>
              </FormGroup>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Latitude</Label>
                    <Input type="number" step="any" min="-90" max="90" placeholder="e.g. 23.588" value={editingRestaurant.lat || ""} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, lat: e.target.value })} />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Longitude</Label>
                    <Input type="number" step="any" min="-180" max="180" placeholder="e.g. 58.382" value={editingRestaurant.lng || ""} onChange={(e) => setEditingRestaurant({ ...editingRestaurant, lng: e.target.value })} />
                  </FormGroup>
                </Col>
              </Row>
              <div className="d-flex gap-2">
                <Button className="btn-auth" type="submit" style={{ flex: 1 }}>Save</Button>
                <Button className="btn-clear-filter" type="button" onClick={() => setEditingRestaurant(null)} style={{ flex: 1 }}>Cancel</Button>
              </div>
            </Form>
          </div>
        </div>
      )}

      {showAddMeal && (
        <div style={overlayStyle} onClick={() => setShowAddMeal(false)}>
          <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h2 style={{ fontSize: "1.4rem" }}>Add Meal</h2>
            <form onSubmit={handleAddMeal}>
              <div className="form-group"><label>Name</label><input type="text" placeholder="Meal name" value={newMeal.name} onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })} required /></div>
              <div className="form-group"><label>Price ($)</label><input type="number" step="0.01" placeholder="9.99" value={newMeal.price} onChange={(e) => setNewMeal({ ...newMeal, price: e.target.value })} required /></div>
              <div className="form-group"><label>Category</label><input type="text" placeholder="e.g. Pizza, Dessert" value={newMeal.category} onChange={(e) => setNewMeal({ ...newMeal, category: e.target.value })} /></div>
              <div className="form-group"><label>Image URL</label><input type="text" placeholder="https://..." value={newMeal.image} onChange={(e) => setNewMeal({ ...newMeal, image: e.target.value })} /></div>
              <div className="d-flex gap-2">
                <Button className="btn-auth" type="submit" style={{ flex: 1 }}>Add Meal</Button>
                <Button className="btn-clear-filter" type="button" onClick={() => setShowAddMeal(false)} style={{ flex: 1 }}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMeal && (
        <div style={overlayStyle} onClick={() => setEditingMeal(null)}>
          <div className="auth-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h2 style={{ fontSize: "1.4rem" }}>Edit Meal</h2>
            <form onSubmit={handleEditMeal}>
              <div className="form-group"><label>Name</label><input type="text" value={editingMeal.name} onChange={(e) => setEditingMeal({ ...editingMeal, name: e.target.value })} required /></div>
              <div className="form-group"><label>Price ($)</label><input type="number" step="0.01" value={editingMeal.price} onChange={(e) => setEditingMeal({ ...editingMeal, price: e.target.value })} required /></div>
              <div className="form-group"><label>Category</label><input type="text" value={editingMeal.category} onChange={(e) => setEditingMeal({ ...editingMeal, category: e.target.value })} /></div>
              <div className="form-group"><label>Image URL</label><input type="text" value={editingMeal.image} onChange={(e) => setEditingMeal({ ...editingMeal, image: e.target.value })} /></div>
              <div className="d-flex gap-2">
                <Button className="btn-auth" type="submit" style={{ flex: 1 }}>Save Changes</Button>
                <Button className="btn-clear-filter" type="button" onClick={() => setEditingMeal(null)} style={{ flex: 1 }}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal isOpen={deleteModal.open} toggle={() => setDeleteModal({ open: false, type: "", id: null })} centered>
        <ModalHeader toggle={() => setDeleteModal({ open: false, type: "", id: null })} style={{ background: "var(--bg-card)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}>Confirm Delete</ModalHeader>
        <ModalBody style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}>Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.</ModalBody>
        <ModalFooter style={{ background: "var(--bg-card)", borderColor: "var(--border-color)" }}>
          <Button className="btn-cancel" onClick={handleConfirmDelete}>Yes, Delete</Button>
          <Button className="btn-clear-filter" onClick={() => setDeleteModal({ open: false, type: "", id: null })}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
