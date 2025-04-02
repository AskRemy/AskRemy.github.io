import React from 'react';
import './EquipmentList.css';

const EquipmentList = ({ equipment }) => {
  // Default mock equipment if none is provided
  const defaultEquipment = [
    'Large pot',
    'Colander',
    'Large skillet or frying pan',
    'Mixing bowl',
    'Tongs or large fork',
    'Cheese grater'
  ];

  // Use provided equipment or fall back to mock data
  const equipmentItems = equipment || defaultEquipment;

  return (
    <div className="equipment-list">
      <h3>Equipment Needed</h3>
      <ul>
        {equipmentItems.map((item, index) => (
          <li key={index}>
            <span className="equipment-icon">🍳</span>
            <span className="equipment-name">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EquipmentList;