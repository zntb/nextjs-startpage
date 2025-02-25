'use client';

import { useState } from 'react';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import Modal from './modal';
import UpdateDropdownForm from './update-dropdown-form';
import AddDropdownForm from './add-dropdown-form';
import { changeOrder, deleteDropdownItem } from '@/lib/actions';
import toast from 'react-hot-toast';
import classes from './dropdown.module.css';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable/dist';
import { CSS } from '@dnd-kit/utilities';
import { Link } from '@/lib/actions';

type DropdownContentProps = {
  category: string;
  links: { id: string; title: string; url: string; order: number }[];
  categoryId: string;
};

function ManageDropdown({ category, links, categoryId }: DropdownContentProps) {
  const [items, setItems] = useState(links);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart() {}

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((link) => link.id === active.id);
    const newIndex = items.findIndex((link) => link.id === over.id);

    const newLinksOrder = arrayMove(items, oldIndex, newIndex);

    // Update the order in the database for each item in the new order
    newLinksOrder.forEach((link, index) => {
      // Update each link's `order` to match its new position
      changeOrder(link.id, index);
    });

    // Update the local state to reflect the new order in the UI
    setItems(newLinksOrder);
  }

  const handleAddClick = () => {
    setEditIndex(null);
    setIsAdding(true);
  };

  const handleEditClick = (index: number) => {
    setEditIndex(index);
    setIsAdding(false);

    // console.log(`Editing link at index: ${index}`);
  };

  const handleDeleteClick = (index: number) => {
    const linkId = links[index].id;

    // console.log(`Deleting link with ID: ${linkId}`);

    if (!linkId) return;

    if (!confirm('Are you sure you want to delete this link?')) return;

    toast
      .promise(deleteDropdownItem(linkId), {
        loading: 'Deleting link...',
        success: 'Link deleted successfully',
        error: 'Failed to delete link',
      })
      .catch((error) => console.error(error));

    setEditIndex(null);
    setIsAdding(false);
  };

  const handleCloseModal = () => {
    // console.log('Closing modal');
    setEditIndex(null);
    setIsAdding(false);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.id)}>
        <div className={classes.dropdown}>
          <button className={classes.dropbtn}>{category}</button>
          <div className={classes.dropdownContent}>
            {items.map((link, index) => (
              <SortableLink
                key={link.id}
                link={link as Link}
                index={index}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
              />
            ))}
            <button className={classes.addLinkButton} onClick={handleAddClick}>
              <FaPlusCircle />
            </button>
          </div>
        </div>
      </SortableContext>

      {editIndex !== null && (
        <Modal isVisible={editIndex !== null} onClose={handleCloseModal}>
          <UpdateDropdownForm
            link={items[editIndex]}
            onClose={handleCloseModal}
            categoryId={categoryId}
          />
        </Modal>
      )}

      {isAdding && (
        <Modal isVisible={isAdding} onClose={handleCloseModal}>
          <AddDropdownForm onClose={handleCloseModal} categoryId={categoryId} />
        </Modal>
      )}
    </DndContext>
  );
}

interface SortableLinkProps {
  link: Link;
  index: number;
  onEditClick: (index: number) => void;
  onDeleteClick: (index: number) => void;
}

function SortableLink({
  link,
  index,
  onEditClick,
  onDeleteClick,
}: SortableLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={classes.dropdownLinkContainer}
    >
      <div className={classes.draggableArea} {...attributes} {...listeners}>
        <span className={classes.linkTitle}>{link.title}</span>
      </div>
      <div className={classes.buttonContainer}>
        <button
          className={classes.updateButton}
          onClick={(e) => {
            e.stopPropagation();
            onEditClick(index);
          }}
        >
          <FaEdit color="#222222" />
        </button>
        <button
          className={classes.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick(index);
          }}
        >
          <FaTrash color="#e46161" />
        </button>
      </div>
    </div>
  );
}

export default ManageDropdown;
