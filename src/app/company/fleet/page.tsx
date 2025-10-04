'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoginSimulator from '../../../components/LoginSimulator';
import { CompanyProtected } from '../../../components/ProtectedRoute';
import VehiclesListing from '@/components/company/VehiclesListing';
import PopularFeeds from '../../../components/company/PopularFeeds';
import VehicleFormModal from '@/components/company/VehicleFormModal';
import DriverFormModal from '@/components/company/DriverFormModal';
import DeleteConfirmationModal from '@/components/company/DeleteConfirmationModal';
import { companyFleetData } from '../../../lib/mockApi';

import { Vehicle, Driver } from '@/lib/mockApi';

export default function CompanyFleetPage() {
  const router = useRouter();

  // State for vehicles and drivers
  const [vehicles, setVehicles] = useState<Vehicle[]>(
    companyFleetData.vehicles
      .filter(
        (v) =>
          typeof v.statusBadge === 'string' &&
          ['Assigned', 'Available', 'In Transit'].includes(v.statusBadge) &&
          typeof v.model === 'string' && // Ensure model is a string
          (v.ownership === 'Owned' || v.ownership === 'Attached') // Ensure ownership is valid
      )
      .map((v) => ({
        ...v,
        statusBadge: v.statusBadge as 'Assigned' | 'Available' | 'In Transit',
        ownership: v.ownership as 'Owned' | 'Attached',
      }))
  );

  const [drivers, setDrivers] = useState<Driver[]>(companyFleetData.drivers);

  // Modal states
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Current items being edited/deleted
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [deleteItem, setDeleteItem] = useState<{
    id: string;
    name: string;
    type: 'vehicle' | 'driver';
  } | null>(null);

  // Vehicle CRUD handlers
  const handleAddVehicle = () => {
    setCurrentVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setDeleteItem({
      id: vehicle.id,
      name: vehicle.name,
      type: 'vehicle',
    });
    setIsDeleteModalOpen(true);
  };

  const handleSaveVehicle = (vehicle: Vehicle) => {
    if (currentVehicle) {
      // Edit existing vehicle
      setVehicles((prev) =>
        prev.map((v) => (v.id === vehicle.id ? vehicle : v))
      );
    } else {
      // Add new vehicle
      setVehicles((prev) => [...prev, vehicle]);
    }
  };

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/company/fleet/vehicles/${vehicleId}`);
  };

  // Driver CRUD handlers
  const handleAddDriver = () => {
    setCurrentDriver(null);
    setIsDriverModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsDriverModalOpen(true);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDeleteItem({
      id: driver.id,
      name: driver.name,
      type: 'driver',
    });
    setIsDeleteModalOpen(true);
  };

  const handleSaveDriver = (driver: Driver) => {
    if (currentDriver) {
      // Edit existing driver
      setDrivers((prev) => prev.map((d) => (d.id === driver.id ? driver : d)));
    } else {
      // Add new driver
      setDrivers((prev) => [...prev, driver]);
    }
  };

  const handleDriverClick = (driverId: string) => {
    router.push(`/company/fleet/drivers/${driverId}`);
  };

  // Delete confirmation handler
  const handleConfirmDelete = () => {
    if (!deleteItem) return;

    if (deleteItem.type === 'vehicle') {
      setVehicles((prev) => prev.filter((v) => v.id !== deleteItem.id));
    } else {
      setDrivers((prev) => prev.filter((d) => d.id !== deleteItem.id));
    }

    setDeleteItem(null);
  };

  return (
    <CompanyProtected>
      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Vehicles & Drivers Listing Section */}
          <VehiclesListing
            vehicles={vehicles}
            drivers={drivers}
            onAddVehicle={handleAddVehicle}
            onEditVehicle={handleEditVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onVehicleClick={handleVehicleClick}
            onAddDriver={handleAddDriver}
            onEditDriver={handleEditDriver}
            onDeleteDriver={handleDeleteDriver}
            onDriverClick={handleDriverClick}
          />

          {/* Popular Feeds Section */}
          <PopularFeeds feeds={companyFleetData.popularFeeds} />
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <VehicleFormModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        vehicle={currentVehicle}
        mode={currentVehicle ? 'edit' : 'add'}
      />

      <DriverFormModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSave={handleSaveDriver}
        driver={currentDriver}
        mode={currentDriver ? 'edit' : 'add'}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteItem?.type === 'vehicle' ? 'Vehicle' : 'Driver'}?`}
        message={`Are you sure you want to delete this ${deleteItem?.type}?`}
        itemName={deleteItem?.name || ''}
        type={deleteItem?.type || 'vehicle'}
      />
    </CompanyProtected>
  );
}
